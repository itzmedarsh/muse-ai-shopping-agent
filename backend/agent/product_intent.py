"""Deterministic product-type parsing for MUSE's synthetic catalogue."""
import re

SLOT_PATTERNS = [
    ("iphone", r"\biphones?\b"),
    ("phone", r"\b(?:smartphones?|mobile phones?|cell phones?)\b"),
    ("laptop", r"\b(?:laptops?|notebooks?)\b"),
    ("usb_c_hub", r"\b(?:usb[ -]?c hubs?|usb[ -]?c docks?|docking stations?|hubs?)\b"),
    ("headphones", r"\b(?:headphones?|headsets?)\b"),
    ("earbuds", r"\b(?:earbuds?|earphones?)\b"),
    ("keyboard", r"\bkeyboards?\b"),
    ("mouse", r"\b(?:mice|mouse)\b"),
    ("ssd", r"\b(?:ssds?|solid state drives?)\b"),
    ("tablet", r"\b(?:tablets?|ipads?)\b"),
    ("smartwatch", r"\b(?:smartwatches?|watches?)\b"),
    ("t_shirt", r"\b(?:t[ -]?shirts?|tees?)\b"),
    ("shirt", r"\bshirts?\b"),
    ("jeans", r"\bjeans?\b"),
    ("trousers", r"\b(?:trousers?|chinos|pants)\b"),
    ("shoes", r"\b(?:shoes?|sneakers?|footwear|sandals?|boots?)\b"),
    ("bag", r"\b(?:bags?|backpacks?)\b"),
    ("phone_case", r"\b(?:phone cases?|covers?)\b"),
    ("charger", r"\b(?:chargers?|charging adapters?)\b"),
    ("power_bank", r"\bpower banks?\b"),
]

SLOT_QUERIES = {
    "iphone":"iphone", "phone":"smartphone", "laptop":"laptop",
    "usb_c_hub":"USB-C hub", "headphones":"headphones", "earbuds":"earbuds",
    "keyboard":"keyboard", "mouse":"mouse", "ssd":"SSD", "tablet":"tablet",
    "smartwatch":"smartwatch", "t_shirt":"t-shirt", "shirt":"shirt",
    "jeans":"jeans", "trousers":"trousers", "shoes":"shoes", "bag":"backpack",
    "phone_case":"phone case", "charger":"charger", "power_bank":"power bank",
}


def requested_slots(text):
    text = str(text or "").lower()
    found = []
    for slot, pattern in SLOT_PATTERNS:
        if re.search(pattern, text, re.I):
            # Avoid treating "t-shirt" as a second generic shirt request.
            if slot == "shirt" and "t_shirt" in found:
                continue
            if slot not in found:
                found.append(slot)
    # "Outfit" is a multi-item fashion request even when the user does not
    # name individual garments. Default to a wearable top + bottom combination.
    outfit_intent = bool(re.search(r"\b(outfit|full look|complete look)\b", text, re.I))
    clothing_slots = {"t_shirt", "shirt", "jeans", "trousers"}
    if outfit_intent and not any(slot in clothing_slots for slot in found):
        found.extend(["t_shirt", "jeans"])
    return found


def product_matches_slot(product, slot):
    fields = [product.get(k, "") for k in ("name", "title", "brand", "category", "subcategory", "description")]
    specs = product.get("specifications") or {}
    if isinstance(specs, dict):
        fields.extend(str(v) for v in specs.values())
    hay = " ".join(str(v) for v in fields if v is not None).lower()
    sub = str(product.get("subcategory") or "").lower()
    rules = {
        "iphone": lambda: "iphone" in hay,
        "phone": lambda: bool(re.search(r"\b(?:smartphone|mobile phone|cell phone)\b", hay)) and "iphone" not in hay,
        "laptop": lambda: bool(re.search(r"\b(?:laptop|notebook)\b", hay)),
        "usb_c_hub": lambda: bool(re.search(r"\b(?:usb[ -]?c hub|usb[ -]?c dock|docking station|hub)\b", hay)),
        "headphones": lambda: bool(re.search(r"\b(?:headphones?|headsets?)\b", hay)),
        "earbuds": lambda: bool(re.search(r"\b(?:earbuds?|earphones?)\b", hay)),
        "keyboard": lambda: "keyboard" in hay,
        "mouse": lambda: bool(re.search(r"\b(?:mouse|mice)\b", hay)),
        "ssd": lambda: bool(re.search(r"\b(?:ssd|solid state drive)\b", hay)),
        "tablet": lambda: bool(re.search(r"\b(?:tablet|ipad)\b", hay)),
        "smartwatch": lambda: bool(re.search(r"\b(?:smartwatch|watch)\b", hay)),
        "t_shirt": lambda: bool(re.search(r"\b(?:t[ -]?shirt|tee)\b", hay)),
        "shirt": lambda: "shirt" in sub and not bool(re.search(r"\b(?:t[ -]?shirt|tee)\b", hay)),
        "jeans": lambda: "jean" in hay,
        "trousers": lambda: bool(re.search(r"\b(?:trouser|chino|pants?)\b", hay)),
        "shoes": lambda: bool(re.search(r"\b(?:shoe|sneaker|footwear|sandal|boot)\b", hay)),
        "bag": lambda: bool(re.search(r"\b(?:bag|backpack)\b", hay)),
        "phone_case": lambda: bool(re.search(r"\b(?:phone case|phone cover)\b", hay)),
        "charger": lambda: bool(re.search(r"\bcharger\b", hay)),
        "power_bank": lambda: bool(re.search(r"\bpower bank\b", hay)),
    }
    fn = rules.get(slot)
    return bool(fn()) if fn else False

