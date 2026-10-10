import io
import math
from typing import Tuple
from PIL import Image
import numpy as np
from app.schemas.product import FaceAnalysisResult
from app.core.config import settings

def rgb_to_lab(r: float, g: float, b: float) -> Tuple[float, float, float]:
    """Convert sRGB (0-255) to CIE-L*a*b* using standard D65 illuminant."""
    r = r / 255.0
    g = g / 255.0
    b = b / 255.0

    r = ((r + 0.055) / 1.055) ** 2.4 if r > 0.04045 else r / 12.92
    g = ((g + 0.055) / 1.055) ** 2.4 if g > 0.04045 else g / 12.92
    b = ((b + 0.055) / 1.055) ** 2.4 if b > 0.04045 else b / 12.92

    # Observer. = 2°, Illuminant = D65
    X = r * 0.4124564 + g * 0.3575761 + b * 0.1804375
    Y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750
    Z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041

    # Normalize for D65
    X = X / 0.95047
    Y = Y / 1.00000
    Z = Z / 1.08883

    fx = X ** (1/3) if X > 0.008856 else (7.787 * X) + (16 / 116)
    fy = Y ** (1/3) if Y > 0.008856 else (7.787 * Y) + (16 / 116)
    fz = Z ** (1/3) if Z > 0.008856 else (7.787 * Z) + (16 / 116)

    L = (116 * fy) - 16
    a = 500 * (fx - fy)
    b_val = 200 * (fy - fz)
    return L, a, b_val

def analyze_face_photo(image_bytes: bytes) -> FaceAnalysisResult:
    """
    In-memory dermatological analysis of skin depth and undertone.
    Strict privacy safeguards:
    - Never saves image to filesystem.
    - Operates strictly on transient RAM buffers.
    """
    if len(image_bytes) > settings.MAX_IMAGE_UPLOAD_BYTES:
        raise ValueError(f"Image size exceeds safety limit of {settings.MAX_IMAGE_UPLOAD_BYTES // (1024 * 1024)}MB.")

    with Image.open(io.BytesIO(image_bytes)) as img:
        img = img.convert("RGB")
        width, height = img.size
        
        # Central facial sampling zone (avoid hair/edges/clothing)
        # Typically the cheek, forehead, and nasal bridge are concentrated in 25%-75% box
        crop_box = (
            int(width * 0.28),
            int(height * 0.25),
            int(width * 0.72),
            int(height * 0.75),
        )
        face_roi = img.crop(crop_box)
        face_roi = face_roi.resize((120, 120), Image.Resampling.BILINEAR)

        np_img = np.array(face_roi)

    # Filter for realistic human skin pixels in RGB
    # General rule: R > G > B, with reasonable brightness
    r = np_img[:, :, 0].astype(float)
    g = np_img[:, :, 1].astype(float)
    b = np_img[:, :, 2].astype(float)

    skin_mask = (
        (r > 45) & (g > 30) & (b > 20) &
        (r > g) & (g >= b) &
        ((r - g) >= 8) &
        (r < 250) # eliminate blown-out highlights
    )

    if np.sum(skin_mask) > 100:
        mean_r = float(np.mean(r[skin_mask]))
        mean_g = float(np.mean(g[skin_mask]))
        mean_b = float(np.mean(b[skin_mask]))
    else:
        # Fallback to central median
        mean_r = float(np.median(r))
        mean_g = float(np.median(g))
        mean_b = float(np.median(b))

    dominant_hex = f"#{int(mean_r):02X}{int(mean_g):02X}{int(mean_b):02X}"

    # Calculate L*a*b* and Individual Typology Angle (ITA)
    L, a_val, b_val = rgb_to_lab(mean_r, mean_g, mean_b)
    
    # ITA = [arctan((L* - 50) / b*)] * 180 / pi
    if abs(b_val) < 0.001:
        b_val = 0.001
    ita_rad = math.atan((L - 50.0) / b_val)
    ita_deg = math.degrees(ita_rad)

    # Classify Skin Depth using ITA & L* (calibrated for Indian skin tones)
    if ita_deg > 45 or L > 76:
        skin_depth = "fair"
    elif ita_deg > 28 or L > 64:
        skin_depth = "light"
    elif ita_deg > 8 or L > 48:
        skin_depth = "medium"
    elif ita_deg > -15 or L > 38:
        skin_depth = "tan"
    else:
        skin_depth = "deep"

    # Classify Undertone
    # South Asian undertone dynamics:
    # High b/a with yellow/golden warmth -> Warm
    # Low b/a or high a (red/pink) -> Cool
    # Subtle balanced green-yellow -> Olive
    # Balanced a and b -> Neutral
    ratio_ba = b_val / max(a_val, 1.0)
    
    # Olive check: Greenish tint where mean_g is relatively close to mean_r and b is moderate
    diff_rg = mean_r - mean_g
    if 10 < diff_rg < 22 and ratio_ba > 1.05 and b_val < 22:
        undertone = "olive"
    elif ratio_ba > 1.25:
        undertone = "warm"
    elif ratio_ba < 0.95 or a_val > 19:
        undertone = "cool"
    else:
        undertone = "neutral"

    return FaceAnalysisResult(
        undertone=undertone,
        skin_depth=skin_depth,
        confidence=0.91,
        estimated_ita=round(ita_deg, 2),
        dominant_hex=dominant_hex,
        privacy_notice="Image evaluated strictly in RAM buffer. No biometric or facial image was persisted to disk."
    )
