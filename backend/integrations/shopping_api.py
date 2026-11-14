"""Local-only product discovery for MUSE. All records are synthetic mock data."""
from copy import deepcopy
import math, re
from backend.products import products as core_products
from backend.data.discovery_products import discovery_products
from backend.data.fashion_products import fashion_products
from backend.data.mock_catalogue import mock_products

def _catalogue_products():
    rows=[]
    for source_name, catalogue in (("core_catalogue",core_products),("discovery_catalogue",discovery_products),("fashion_catalogue",fashion_products),("bundled_mock_catalogue",mock_products)):
        for original in catalogue:
            if not isinstance(original,dict): continue
            item=deepcopy(original); item.setdefault("currency","INR"); item["source"]="muse_mock_catalogue"; item["catalogue_source"]=source_name; item.setdefault("store_id",f"{source_name}:{item.get('id',item.get('name','item'))}")
            # Existing legacy image URLs are intentionally not used in mock-only mode.
            if source_name != "bundled_mock_catalogue":
                item["image"] = None; item["image_url"] = None
            rows.append(item)
    return rows

def _valid_price(p):
    try: return math.isfinite(float(p.get("price"))) and float(p.get("price")) >= 0
    except (TypeError,ValueError,OverflowError): return False

def _matches(p, query):
    terms=[t for t in re.findall(r"[a-z0-9]+",str(query).lower()) if t not in {"find","show","search","recommend","suggest","me","need","want","best","for","under","below","with","a","an","the","please","i","am","looking"}]
    if not terms: return True
    hay=" ".join(str(p.get(k,"")) for k in ("name","brand","category","subcategory","description","color")) + " " + str(p.get("specifications",{}))
    return any(t in hay.lower() for t in terms)

def discover_products(query="", max_price=None, category=None, existing_device=None, platform=None, color=None, limit=60, **kwargs):
    rows=_catalogue_products()
    if query:
        rows=[p for p in rows if _matches(p,query)]
        q=str(query).lower()
        # Strict product-family gates prevent a shared keyword from returning another category.
        family_rules = [
            (r"\b(t[ -]?shirts?|tees?)\b", ("t-shirt", "oversized t-shirt")),
            (r"\b(oxford|formal|button[- ]?down) shirts?\b", ("oxford shirt",)),
            (r"\bshirts?\b", ("t-shirt", "oversized t-shirt", "polo shirt", "oxford shirt")),
            (r"\biphones?\b", ("iphone",)),
            (r"\b(phones?|smartphones?|mobiles?)\b", ("android smartphone",)),
            (r"\b(headphones?)\b", ("wireless headphones",)),
            (r"\b(earbuds?)\b", ("bluetooth earbuds",)),
            (r"\b(shoes?|sneakers?|footwear)\b", ("running shoes", "casual sneakers")),
            (r"\b(hoodies?)\b", ("hoodie",)),
            (r"\b(jeans?)\b", ("jeans",)),
            (r"\b(laptops?|notebooks?)\b", ("laptop",)),
        ]
        for pattern, allowed in family_rules:
            if re.search(pattern,q):
                rows=[p for p in rows if str(p.get("subcategory", "")).lower() in allowed
                      or str(p.get("category", "")).lower() in allowed
                      or any(label in str(p.get("category", "")).lower() for label in allowed)]
                break
    if category:
        requested_category = str(category).strip().lower()
        category_aliases = {
            "fashion": {"fashion", "clothing", "apparel", "footwear"},
            "audio": {"audio", "electronics"},
            "electronics": {"electronics"},
            "home appliances": {"home appliances", "appliances"},
            "accessories": {"accessories"},
        }
        allowed_categories = category_aliases.get(requested_category, {requested_category})
        rows = [p for p in rows if str(p.get("category", "")).strip().lower() in allowed_categories]
    if color: rows=[p for p in rows if str(color).casefold() in str(p.get("color") or p.get("specifications",{}).get("color","")).casefold()]
    if max_price not in (None,""):
        try: budget=float(max_price); rows=[p for p in rows if _valid_price(p) and float(p["price"])<=budget]
        except (TypeError,ValueError): pass
    if platform and str(platform).lower()=="android": rows=[p for p in rows if "android" in str(p.get("specifications",{}).get("operating_system","")).lower() or "android" in str(p.get("name","")).lower()]
    rows.sort(key=lambda p: (1 if color and str(color).casefold()==str(p.get("color","")).casefold() else 0, float(p.get("price",0))), reverse=True)
    try: cap=max(1,min(int(limit),300))
    except (TypeError,ValueError): cap=60
    return {"products":rows[:cap],"external_products":[],"external_source":"bundled_mock_catalogue","external_api_status":"disabled_mock_only","external_api_message":"External product APIs are disabled. All products are synthetic MUSE mock data.","total_local_results":len(rows),"total_external_results":0,"is_sample_data":True}
