import io
from PIL import Image
import pytest
from app.services.face_analysis import analyze_face_photo, rgb_to_lab

def test_rgb_to_lab_conversion():
    # Test D65 reference white
    L, a, b = rgb_to_lab(255, 255, 255)
    assert round(L) == 100
    assert abs(a) < 1.0
    assert abs(b) < 1.0

def test_warm_medium_skin_analysis():
    # Create synthetic warm medium skin image: RGB(215, 160, 115)
    img = Image.new("RGB", (200, 200), color=(215, 160, 115))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    image_bytes = buf.getvalue()

    result = analyze_face_photo(image_bytes)

    assert result.skin_depth in ["medium", "light"]
    assert result.undertone == "warm"
    assert "persisted to disk" in result.privacy_notice.lower()
    assert result.confidence > 0.8

def test_image_size_safety_limit():
    # Oversized image bytes simulation (> 30MB limit)
    fake_huge_bytes = b"0" * (35 * 1024 * 1024)
    with pytest.raises(ValueError) as excinfo:
        analyze_face_photo(fake_huge_bytes)
    assert "exceeds safety limit" in str(excinfo.value)
