"""Fashion specialist: handles clothing-size preferences and shoe measurements."""
import re

from backend.services.fashion_service import recommend_clothing_size
from backend.services.shoe_size_service import recommend_shoe_size


APPAREL_TYPES = {
    "t-shirt", "t-shirts", "shirt", "shirts", "jean", "jeans",
    "trouser", "trousers", "hoodie", "hoodies", "jacket", "jackets",
    "sweatshirt", "sweatshirts", "dress", "dresses", "shorts",
}
SHOE_TYPES = {"shoe", "shoes", "sneaker", "sneakers", "footwear"}
CLOTHING_SIZES = {"XS", "S", "M", "L", "XL", "XXL", "XXXL", "2XL", "3XL"}


def _measurement(text, label):
    pattern = (
        rf"\b{re.escape(label)}\s*(?:is|of|:)?\s*"
        r"(\d+(?:\.\d+)?)\s*(cm|centimetres?|inches?|inch|in)?\b"
    )
    match = re.search(pattern, text, re.I)
    if not match:
        return None
    value = float(match.group(1))
    if (match.group(2) or "cm").lower() in {"in", "inch", "inches"}:
        value *= 2.54
    return value


def _usual_clothing_size(text):
    # Require contextual wording so an unrelated "L" or product code is not treated as a size.
    patterns = (
        r"\b(?:my\s+)?(?:usual\s+)?(?:clothing\s+)?size\s*(?:is|:|=)?\s*(XXXL|XXL|XXS|2XL|3XL|XL|XS|[SML])\b",
        r"\b(?:i\s+)?(?:usually\s+)?wear\s+(XXXL|XXL|XXS|2XL|3XL|XL|XS|[SML])\b",
    )
    for pattern in patterns:
        match = re.search(pattern, text, re.I)
        if match:
            size = match.group(1).upper()
            return {"2XL": "XXL", "3XL": "XXXL"}.get(size, size)
    return None


def run_fashion_agent(product, user_request):
    subcategory = str(product.get("subcategory") or "").strip().lower()
    category = str(product.get("category") or "").strip().lower()
    request = str(user_request or "")

    is_shoe = (
        subcategory in SHOE_TYPES
        or (category in {"fashion", "clothing", "apparel"} and
            re.search(r"\b(shoes?|sneakers?|footwear)\b", request, re.I))
    )

    if is_shoe:
        match = re.search(r"\b(?:foot\s*length|my\s+foot\s+is)?\s*(\d+(?:\.\d+)?)\s*cm\b", request, re.I)
        if not match:
            data = {
                "status": "measurement_required",
                "message": "What is your foot length in centimetres? For example, 26 cm.",
                "missing_measurements": ["foot_length_cm"],
            }
            return {"agent": "Fashion Fit Agent", "status": data["status"],
                    "message": data["message"], "data": data}
        try:
            data = recommend_shoe_size(product, float(match.group(1)))
            return {"agent": "Fashion Fit Agent", "status": data.get("status", "completed"),
                    "message": data.get("message", "Shoe sizing evaluated."), "data": data}
        except Exception as exc:
            data = {"status": "error", "message": f"Shoe sizing failed: {exc}"}
            return {"agent": "Fashion Fit Agent", "status": "error",
                    "message": data["message"], "data": data}

    is_apparel = (
        subcategory in APPAREL_TYPES
        or category in {"fashion", "clothing", "apparel"}
        or bool(re.search(
            r"\b(t-?shirts?|shirts?|jeans|trousers?|hoodies?|jackets?|"
            r"sweatshirts?|dresses?|shorts)\b", request, re.I
        ))
    )
    if not is_apparel:
        data = {"status": "not_applicable",
                "message": "Fashion sizing is not applicable to this product."}
        return {"agent": "Fashion Fit Agent", "status": data["status"],
                "message": data["message"], "data": data}

    usual_size = _usual_clothing_size(request)
    chest = _measurement(request, "chest")
    waist = _measurement(request, "waist")

    # A normal clothing-size preference is enough to continue shopping.
    # Measurements are optional and only used when the selected product has a usable chart.
    if usual_size and chest is None and waist is None:
        available_sizes = [str(size).upper() for size in (product.get("available_sizes") or [])]
        if available_sizes and usual_size not in available_sizes:
            data = {
                "status": "preferred_size_unavailable",
                "usual_size": usual_size,
                "recommended_size": None,
                "available_sizes": product.get("available_sizes") or [],
                "confidence": "user_preference",
                "message": (
                    f"Your usual size ({usual_size}) is not listed for this item. "
                    "Choose from the available sizes shown and check the seller's fit guide."
                ),
                "is_sample_data": bool(product.get("is_sample_data", True)),
            }
        else:
            data = {
                "status": "preference_captured",
                "usual_size": usual_size,
                "recommended_size": usual_size,
                "available_sizes": product.get("available_sizes") or [],
                "confidence": "user_preference",
                "message": f"Your usual clothing size ({usual_size}) has been captured. Product-specific fit is not independently verified.",
                "is_sample_data": bool(product.get("is_sample_data", True)),
            }
        return {"agent": "Fashion Fit Agent", "status": data["status"],
                "message": data["message"], "data": data}

    if not usual_size and chest is None and waist is None:
        data = {
            "status": "size_preference_required",
            "message": "What clothing size do you usually wear? (XS, S, M, L, XL or XXL)",
            "missing_measurements": ["usual_size"],
        }
        return {"agent": "Fashion Fit Agent", "status": data["status"],
                "message": data["message"], "data": data}

    try:
        data = recommend_clothing_size(
            product, chest=chest, waist=waist,
            measurements={k: v for k, v in {"chest": chest, "waist": waist}.items()
                          if v is not None},
        )
        if usual_size:
            data["usual_size"] = usual_size
        return {"agent": "Fashion Fit Agent", "status": data.get("status", "completed"),
                "message": data.get("message", "Clothing size evaluated."), "data": data}
    except Exception as exc:
        data = {"status": "error", "message": f"Clothing sizing failed: {exc}"}
        return {"agent": "Fashion Fit Agent", "status": "error",
                "message": data["message"], "data": data}
