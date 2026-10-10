import React, { useState, useRef } from 'react';
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

  const startCamera = async () => {
    try {
      setErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      setMode('camera');
    } catch (err) {
      setErrorMsg('Unable to access webcam. Please check permissions or upload a selfie file instead.');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (JPEG, PNG, or WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 5 MB.');
      return;
    }

    setErrorMsg(null);
    setPreviewUrl(URL.createObjectURL(file));
    uploadAndAnalyze(file);
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
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-display text-stone-900">
            Step 1: Face & Skin Tone Detection
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Capture a selfie in natural light or upload an existing photo to compute your undertone.
          </p>
        </div>

        {/* Privacy Notice Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-xs px-3.5 py-1.5 rounded-full font-medium">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Privacy Guaranteed: Evaluated in RAM, Zero Disk Storage</span>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="font-semibold">Analysis Notice</p>
            <p className="text-rose-700 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Camera / Upload view */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border-2 border-dashed border-stone-300 flex flex-col items-center justify-center p-4">
          {isCameraActive ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 pointer-events-none border-2 border-rose-400/50 rounded-full w-48 h-64 m-auto" />
              <button
                onClick={handleCapturePhoto}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full shadow-lg flex items-center gap-2 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Snap Selfie</span>
              </button>
            </div>
          ) : previewUrl ? (
            <div className="relative w-full h-full">
              <img
                src={previewUrl}
                alt="Face preview"
                className="w-full h-full object-cover rounded-xl"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <RefreshCw className="w-8 h-8 animate-spin mb-2 text-rose-400" />
                  <span className="text-sm font-medium">Measuring ITA & Undertone...</span>
                </div>
              )}
              <button
                onClick={handleReset}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md transition-all"
              >
                Change Photo
              </button>
            </div>
          ) : (
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-sm">
                <Camera className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-stone-800">Select capture method</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Ensure even daylight without colored artificial tint for true shade calibration.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Use Webcam</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
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
          )}
        </div>

        {/* Results / Detected attributes */}
        <div className="flex flex-col justify-center space-y-4">
          {analysisResult ? (
            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-stone-900 text-sm">Face Analysis Complete</span>
                </div>
                <span className="text-xs font-semibold text-stone-500">
                  Confidence: {Math.round(analysisResult.confidence * 100)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-stone-200/60 shadow-2xs">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                    Detected Undertone
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="capitalize font-bold text-base text-stone-900">
                      {analysisResult.undertone}
                    </span>
                    <span className="text-xs text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded">
                      {analysisResult.undertone === 'warm' ? 'Golden/Yellow' : analysisResult.undertone === 'cool' ? 'Rosy/Pink' : analysisResult.undertone === 'olive' ? 'Olive Tint' : 'Neutral Balance'}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-stone-200/60 shadow-2xs">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                    Skin Depth Level
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="capitalize font-bold text-base text-stone-900">
                      {analysisResult.skin_depth}
                    </span>
                    <span className="text-xs text-stone-500 font-mono">
                      ITA: {analysisResult.estimated_ita}°
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-stone-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                    Sampled Skin Swatch
                  </span>
                  <span className="font-mono text-xs font-semibold text-stone-700">
                    {analysisResult.dominant_hex}
                  </span>
                </div>
                <div
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: analysisResult.dominant_hex }}
                />
              </div>

              <p className="text-[11px] text-stone-500 italic">
                {analysisResult.privacy_notice}
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-stone-50/70 border border-stone-200/60 text-stone-500 text-sm space-y-3">
              <h3 className="font-semibold text-stone-800">How GlowGuide AI Works</h3>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5" />
                  <span><strong>Zero Storage Policy:</strong> Photos are passed in-memory to calculate Individual Typology Angle (ITA) and discarded immediately.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5" />
                  <span><strong>Calibrated for South Asian Skin:</strong> Differentiates warm golden undertones, olive undertones, and neutral wheatish complexions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5" />
                  <span><strong>Manual override available:</strong> You can fine-tune or choose any tone below.</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

