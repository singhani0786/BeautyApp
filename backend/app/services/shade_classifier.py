import re
from typing import Dict, Any, Tuple

# Standardized hex swatches for Indian complexion calibration
DEPTH_UNDERTONE_SWATCHES = {
    ("fair", "cool"): "#FCE3D2",
    ("fair", "warm"): "#F8D9B6",
    ("fair", "neutral"): "#F9DBC5",
    ("light", "cool"): "#EEC7A2",
    ("light", "warm"): "#E7BF92",
    ("light", "neutral"): "#ECC39D",
    ("medium", "warm"): "#DFA975",
    ("medium", "cool"): "#D69F78",
    ("medium", "neutral"): "#D9A47B",
    ("medium", "olive"): "#CE9E69",
    ("tan", "warm"): "#BF824A",
    ("tan", "cool"): "#B57A4E",
    ("tan", "neutral"): "#BA7E51",
    ("tan", "olive"): "#B17E49",
    ("deep", "warm"): "#98592A",
    ("deep", "cool"): "#8B4D29",
    ("deep", "neutral"): "#92542D",
}

WARM_KEYWORDS = [
    "warm", "golden", "amber", "honey", "caramel", "toffee", "sun", "sand", "yellow",
    "bronze", "almond", "pecan", "chestnut", "ginger", "cinnamon", "nc"
]
COOL_KEYWORDS = [
    "cool", "rose", "pink", "rosy", "berry", "porcelain", "alabaster", "pearl", "nw"
]
OLIVE_KEYWORDS = [
    "olive", "green", "golden olive", "warm olive"
]
NEUTRAL_KEYWORDS = [
    "neutral", "beige", "buff", "nude", "natural", "classic", "balance"
]

DEEP_KEYWORDS = [
    "deep", "dark", "rich", "mahogany", "espresso", "cocoa", "chocolate", "mocha", "ebony", "walnut"
]
TAN_KEYWORDS = [
    "tan", "wheat", "wheatish", "caramel", "toffee", "cinnamon", "bronze", "almond", "332", "330"
]
MEDIUM_KEYWORDS = [
    "medium", "honey", "sand", "natural", "220", "228", "230", "nc40", "nc42", "w160", "n220"
]
LIGHT_KEYWORDS = [
    "light", "ivory", "vanilla", "buff", "128", "120", "nc25", "nc30"
]
FAIR_KEYWORDS = [
    "fair", "porcelain", "alabaster", "pale", "110", "112", "115"
]

def classify_shade(shade_name: str, product_title: str = "") -> Dict[str, Any]:
    """
    Automatically infers depth level, undertone, and realistic hex swatch from shade title.
    Enables zero-touch dynamic ingestion of any new market cosmetic product.
    """
    text = f"{shade_name} {product_title}".lower()

    # 1. Determine Undertone
    undertone = "neutral"
    if any(k in text for k in OLIVE_KEYWORDS):
        undertone = "olive"
    elif any(k in text for k in WARM_KEYWORDS):
        undertone = "warm"
    elif any(k in text for k in COOL_KEYWORDS):
        undertone = "cool"
    elif any(k in text for k in NEUTRAL_KEYWORDS):
        undertone = "neutral"

    # M.A.C specific notation (NC = Neutral Cool/Golden warm, NW = Neutral Warm/Rosy cool)
    if "nc" in text:
        undertone = "warm"
    elif "nw" in text:
        undertone = "cool"

    # 2. Determine Depth Level
    depth = "medium"
    if any(k in text for k in DEEP_KEYWORDS):
        depth = "deep"
    elif any(k in text for k in TAN_KEYWORDS):
        depth = "tan"
    elif any(k in text for k in FAIR_KEYWORDS):
        depth = "fair"
    elif any(k in text for k in LIGHT_KEYWORDS):
        depth = "light"
    elif any(k in text for k in MEDIUM_KEYWORDS):
        depth = "medium"

    # 3. Extract Shade Code (e.g. 128, 332, NC42, NW45, W160)
    shade_code_match = re.search(r'\b([A-Za-z]{1,3}\d{2,4}|\d{2,4}[A-Za-z]{0,2})\b', shade_name)
    shade_code = shade_code_match.group(1).upper() if shade_code_match else ""

    # 4. Generate Swatch Hex
    hex_color = DEPTH_UNDERTONE_SWATCHES.get((depth, undertone), "#D9A47B")

    return {
        "depth_level": depth,
        "undertone": undertone,
        "shade_code": shade_code,
        "hex_color": hex_color,
    }

def infer_product_metadata(title: str, category: str = "") -> Dict[str, Any]:
    """
    Infers finish, coverage, and skin types from product title or description.
    """
    t = title.lower()

    finish = "natural"
    if "matte" in t:
        finish = "matte"
    elif "dewy" in t or "glow" in t or "luminous" in t:
        finish = "dewy"
    elif "satin" in t:
        finish = "satin"

    coverage = "medium"
    if "full" in t or "high coverage" in t:
        coverage = "full"
    elif "sheer" in t or "light" in t or "tint" in t:
        coverage = "light"

    skin_types = ["all"]
    if finish == "matte":
        skin_types = ["oily", "combination", "normal"]
    elif finish in ["dewy", "hydrating"]:
        skin_types = ["dry", "normal", "sensitive"]

    return {
        "finish": finish,
        "coverage": coverage,
        "skin_types": skin_types,
    }

