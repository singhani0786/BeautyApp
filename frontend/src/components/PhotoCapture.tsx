import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Shield, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { FaceAnalysisResult } from '../types/api';
import { API_BASE_URL } from '../api/config';

interface PhotoCaptureProps {
  onAnalysisComplete: (result: FaceAnalysisResult) => void;
  isLoading: boolean;
  analysisResult: FaceAnalysisResult | null;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  onAnalysisComplete,
  isLoading,
  analysisResult,
}) => {
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Bind video stream once the camera becomes active in DOM
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.warn('Camera video play error:', e));
    }
  }, [isCameraActive]);

  const startCamera = async () => {
    try {
      setErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setMode('camera');
    } catch (err: any) {
      setErrorMsg('Unable to access webcam. Please check camera permissions in your browser or upload a selfie photo instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw un-mirrored for accurate skin reading
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], 'selfie_capture.jpg', { type: 'image/jpeg' });
        setPreviewUrl(URL.createObjectURL(blob));
        stopCamera();
        uploadAndAnalyze(file);
      }
    }, 'image/jpeg', 0.92);
  };

  // Client-side automatic compression for high-res smartphone photos (e.g. 10MB+)
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1600;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                  type: 'image/jpeg',
                });
                resolve(compressed);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.88
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, or WEBP).');
      return;
    }

    setErrorMsg(null);
    setPreviewUrl(URL.createObjectURL(file));

    // Compress heavy mobile camera photos (> 1MB) so upload is instantaneous
    const finalFile = file.size > 1024 * 1024 ? await compressImage(file) : file;
    uploadAndAnalyze(finalFile);
  };

  const uploadAndAnalyze = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE_URL}/api/analyze-face`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to analyze facial undertones.');
      }

      const result: FaceAnalysisResult = await res.json();
      onAnalysisComplete(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with analysis service.');
    }
  };

  const handleReset = () => {
    stopCamera();
    setPreviewUrl(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="font-semibold">Notice</p>
            <p className="text-rose-700 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* 1. Active Camera View */}
      {isCameraActive ? (
        <div className="relative w-full max-w-lg mx-auto aspect-[4/3] bg-stone-900 rounded-2xl overflow-hidden shadow-xl border border-stone-800 flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => {
              videoRef.current?.play().catch(console.warn);
            }}
            style={{ transform: 'scaleX(-1)' }}
            className="w-full h-full object-cover"
          />
          {/* Oval Face Guide Overlay */}
          <div className="absolute inset-0 pointer-events-none border-2 border-emerald-400/80 rounded-[45%] w-44 sm:w-52 h-56 sm:h-64 m-auto shadow-[0_0_30px_rgba(74,222,128,0.3)] flex flex-col justify-end items-center pb-3">
            <span className="text-[10px] text-emerald-200 font-medium uppercase tracking-wider bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              Position face inside oval
            </span>
          </div>
          {/* Action Bar */}
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3 px-4 z-10">
            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-2 bg-stone-900/80 hover:bg-stone-900 text-stone-300 text-xs font-semibold rounded-full border border-stone-700 backdrop-blur-sm transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCapturePhoto}
              className="px-6 py-2.5 bg-[#4A6953] hover:bg-[#3D5644] text-white font-bold rounded-full shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all active:scale-95 text-xs"
            >
              <Camera className="w-4 h-4 text-[#EBF1EC]" />
              <span>Capture Selfie</span>
            </button>
          </div>
        </div>
      ) : previewUrl ? (
        /* 2. Photo Preview & Analysis Status View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <div className="relative aspect-square sm:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm border border-[#E8E2D9] bg-stone-100">
            <img
              src={previewUrl}
              alt="Face preview"
              className="w-full h-full object-cover"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-[#2D2825]/65 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#4A6953] to-transparent absolute top-0 animate-scan-glow" />
                <RefreshCw className="w-8 h-8 animate-spin mb-2 text-emerald-400" />
                <span className="text-sm font-semibold tracking-wide">Measuring ITA° & Undertone...</span>
                <span className="text-[11px] text-stone-300 mt-1">Calibrating Indian Complexion Metrics</span>
              </div>
            )}
            {!isLoading && (
              <button
                type="button"
                onClick={handleReset}
                className="absolute top-3 right-3 bg-white/95 hover:bg-white text-[#2D2825] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md border border-stone-200 transition-all active:scale-95"
              >
                Change Photo
              </button>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {analysisResult ? (
              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-stone-200/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-[#2D2825] text-sm">Face Analysis Complete</span>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-500">
                    Match: {Math.round(analysisResult.confidence * 100)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D9]">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block mb-0.5">
                      Detected Undertone
                    </span>
                    <span className="capitalize font-bold text-sm text-[#2D2825]">
                      {analysisResult.undertone}
                    </span>
                  </div>

                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D9]">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block mb-0.5">
                      Skin Depth
                    </span>
                    <span className="capitalize font-bold text-sm text-[#2D2825]">
                      {analysisResult.skin_depth}
                    </span>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D9] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">
                      Sampled Skin Swatch
                    </span>
                    <span className="font-mono text-xs font-semibold text-stone-700">
                      {analysisResult.dominant_hex}
                    </span>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: analysisResult.dominant_hex }}
                  />
                </div>

                <p className="text-[10px] text-stone-500 italic text-center">
                  Updating your studio recommendations automatically...
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white border border-[#E8E2D9] text-xs text-stone-600 space-y-2">
                <span className="font-semibold text-[#2D2825] block text-sm">AI Shade Detection</span>
                <p>Analyzing individual typology angle (ITA°) and RGB melanin balance directly in memory.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 3. Initial Choice View: Camera or Upload */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
          
          {/* Left Action Box: Open Camera or Upload */}
          <div className="rounded-2xl p-5 sm:p-6 bg-white border border-[#E8E2D9] shadow-xs flex flex-col justify-between text-center">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#EBF1EC] text-[#4A6953] flex items-center justify-center mx-auto mb-3 border border-[#D5E2D8] shadow-2xs">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="font-serif-editorial text-base sm:text-lg font-bold text-[#2D2825]">
                Take Selfie or Upload Photo
              </h4>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Natural daylight without filters provides an accurate 99% foundation and lipstick match.
              </p>
            </div>

            {/* Clear, Unclipped Action Buttons */}
            <div className="flex flex-col gap-2.5 mt-5 w-full">
              <button
                type="button"
                onClick={startCamera}
                className="w-full py-2.5 px-4 bg-[#4A6953] hover:bg-[#3D5644] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <Camera className="w-4 h-4 text-[#EBF1EC]" />
                <span>Open Live Camera</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 text-[#2D2825] border border-[#D9D1C5] hover:border-[#4A6953] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95"
              >
                <Upload className="w-4 h-4 text-stone-600" />
                <span>Upload Face Photo</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Right Information Box: How It Works */}
          <div className="rounded-2xl p-5 sm:p-6 bg-[#F6F2EC] border border-[#E8E1D5] flex flex-col justify-between text-left">
            <div>
              <h4 className="font-serif-editorial text-base font-semibold text-[#2D2825] mb-3">
                How GlowGuide AI Works
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A6953] mt-1.5 flex-shrink-0" />
                  <span>
                    <strong className="text-[#2D2825]">Zero Storage Policy:</strong> Photos are evaluated in-RAM and immediately discarded. Never saved to disk.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A6953] mt-1.5 flex-shrink-0" />
                  <span>
                    <strong className="text-[#2D2825]">South Asian Skin Science:</strong> Calibrated for warm golden, olive, and neutral Indian complexions.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A6953] mt-1.5 flex-shrink-0" />
                  <span>
                    <strong className="text-[#2D2825]">High-Res Compression:</strong> Upload from any iPhone or Android camera with automatic optimization.
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 pt-3 mt-3 border-t border-[#E8E1D5]">
              <Shield className="w-3.5 h-3.5 text-[#4A6953]" />
              <span>Private session • Zero photos saved</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
