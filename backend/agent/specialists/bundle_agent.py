"""Catalogue-wide bundle specialist for MUSE mock products."""
from copy import deepcopy
from backend.integrations.shopping_api import discover_products
import re

# Complementary categories are intentionally broad; the catalogue determines
# what can actually be offered. No retailer inventory or network calls occur.
COMPANIONS = {
    "fashion": ["Footwear", "Accessories"],
    "clothing": ["Footwear", "Accessories"],
    "apparel": ["Footwear", "Accessories"],
    "footwear": ["Fashion", "Accessories"],
    "electronics": ["Accessories"],
    "audio": ["Accessories"],
    "accessories": ["Fashion", "Electronics"],
    "home appliances": ["Accessories"],
}

REQUEST_TERMS = {
    "shirt": ("shirt", "oxford shirt", "t-shirt", "polo shirt"),
    "t-shirt": ("t-shirt", "oversized t-shirt"),
    "tee": ("t-shirt", "oversized t-shirt"),
    "trouser": ("trouser", "chinos", "pants"),
    "pants": ("trouser", "chinos", "pants"),
    "jeans": ("jeans",),
    "shoe": ("shoe", "sneaker", "footwear"),
    "sneaker": ("sneaker",),
    "watch": ("watch",),
    "bag": ("bag", "backpack"),
    "headphone": ("headphone",),
    "earbud": ("earbud",),
    "phone case": ("phone case", "case"),
}


def _price(item):
    try:
        value = float(item.get("price"))
        return value if value >= 0 else None
    except (TypeError, ValueError):
        return None


def _requested_slots(request):
    from backend.agent.product_intent import requested_slots
    return requested_slots(request)


def _matches_slot(item, slot):
    from backend.agent.product_intent import product_matches_slot
    return product_matches_slot(item, slot)


def build_catalogue_bundle(main_product, user_request="", max_price=None, candidates=None):
    """Build one item for every explicitly requested product slot, within total budget."""
    all_rows = candidates if candidates is not None else discover_products(query="", limit=300).get("products", [])
    slots = _requested_slots(user_request)
    currency = str((main_product or {}).get("currency") or "INR").upper()
    pool = [deepcopy(x) for x in all_rows
            if str(x.get("currency") or "INR").upper() == currency and _price(x) is not None]
    budget = None
    try:
        if max_price not in (None, ""):
            budget = float(max_price)
    except (TypeError, ValueError):
        pass

    if not slots:
        price = _price(main_product or {})
        if price is None:
            return {"status":"unavailable","message":"No valid main product was available.","items":[],"total_price":None,"currency":currency}
        return {"status":"not_applicable","message":"No multiple product types were identified.","items":[deepcopy(main_product)],"total_price":price,"currency":currency,"item_count":1,"is_sample_data":True}

    # Apply explicit colour constraints to every outfit component, not just shoes.
    colour_match = re.search(
        r"\b(black|white|beige|navy|blue|red|green|olive|grey|gray|brown)\b",
        str(user_request or ""), re.I
    )
    requested_colour = colour_match.group(1).casefold() if colour_match else None

    # Build a slot->candidate map from the entire local mock catalogue.
    chosen = []
    missing = []
    total = 0.0
    minimum_required_budget = 0.0
    slot_matches = {}
    for slot in slots:
        matches = [x for x in pool if _matches_slot(x, slot)]
        if requested_colour:
            matches = [
                x for x in matches
                if str(x.get("color") or (x.get("specifications") or {}).get("color") or "").casefold()
                == requested_colour
            ]
        matches.sort(key=lambda x: _price(x) or float("inf"))
        slot_matches[slot] = matches
        if matches:
            minimum_required_budget += _price(matches[0])
    for slot in slots:
        matches = slot_matches.get(slot, [])
        match = matches[0] if matches else None
        if match is None:
            missing.append(slot.replace("_", " ") + (
                f" (no {requested_colour} match)" if requested_colour else ""
            ))
            continue
        price = _price(match)
        if budget is not None and total + price > budget:
            missing.append(slot.replace("_", " ") + " (over budget)")
            continue
        chosen.append(deepcopy(match))
        total += price

    complete = len(chosen) == len(slots)
    if not chosen:
        status = "unavailable"
    elif complete:
        status = "completed"
    else:
        status = "partial"
    if complete:
        message = "All requested product types were matched within the stated total budget." if budget is not None else "All requested product types were matched in the MUSE mock catalogue."
    else:
        message = "Could not complete the requested bundle. Missing or over-budget items: " + ", ".join(missing) + ". No unrelated substitute was added."
        if budget is not None and len(slot_matches) == len(slots) and all(slot_matches.values()) and minimum_required_budget > budget:
            message += f" The cheapest complete matching combination costs ₹{minimum_required_budget:,.0f}; increase the budget by ₹{minimum_required_budget - budget:,.0f} to complete it."
    return {"status":status,"message":message,"items":chosen,"total_price":round(total,2),
            "main_price":round(_price(chosen[0]),2) if chosen else None,"currency":currency,
            "budget":budget,"within_budget":budget is None or total <= budget,
            "skipped_items":missing,"item_count":len(chosen),"is_sample_data":True,
            "requested_items":slots,"complete":complete,
            "requested_color":requested_colour,
            "minimum_required_budget":round(minimum_required_budget, 2) if len(slot_matches) == len(slots) and all(slot_matches.values()) else None,
            "budget_shortfall":round(max(0.0, minimum_required_budget - budget), 2) if budget is not None and len(slot_matches) == len(slots) and all(slot_matches.values()) else None}

def run_bundle_agent(product, is_local_demo=True, user_request="", max_price=None, candidates=None):
    if not is_local_demo:
        data = {"status": "unavailable", "message": "Bundles are only built from the local MUSE mock catalogue.", "items": [], "total_price": None}
    else:
        data = build_catalogue_bundle(product, user_request, max_price, candidates)
    return {"agent": "Bundle Agent", "status": data["status"], "message": data["message"], "data": data}




