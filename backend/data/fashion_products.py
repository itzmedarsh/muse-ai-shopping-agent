# Illustrative product photography for synthetic catalogue items.
# These are category/style reference photos, not verified photos of real SKUs.
FASHION_IMAGE_IDS = {
    101: "photo-1542291026-7eec264c27ff",
    102: "photo-1552346154-21d32810aba3",
    103: "photo-1495555961986-6d4c1ecb7be3",
    104: "photo-1542291026-7eec264c27ff",
    105: "photo-1552346154-21d32810aba3",
    106: "photo-1495555961986-6d4c1ecb7be3",
    107: "photo-1542291026-7eec264c27ff",
    108: "photo-1552346154-21d32810aba3",
    109: "photo-1495555961986-6d4c1ecb7be3",
    110: "photo-1542291026-7eec264c27ff",
    111: "photo-1552346154-21d32810aba3",
    112: "photo-1495555961986-6d4c1ecb7be3",
    113: "photo-1521572163474-6864f9cf17ab",
    114: "photo-1576566588028-4147f3842f27",
    115: "photo-1521572163474-6864f9cf17ab",
    116: "photo-1576566588028-4147f3842f27",
    117: "photo-1521572163474-6864f9cf17ab",
    118: "photo-1576566588028-4147f3842f27",
    119: "photo-1521572163474-6864f9cf17ab",
    120: "photo-1576566588028-4147f3842f27",
    121: "photo-1598033129183-c4f50c736f10",
    122: "photo-1596755094514-f87e34085b2c",
    123: "photo-1598033129183-c4f50c736f10",
    124: "photo-1596755094514-f87e34085b2c",
    125: "photo-1598033129183-c4f50c736f10",
    126: "photo-1542272604-787c3835535d",
    127: "photo-1542272604-787c3835535d",
    128: "photo-1542272604-787c3835535d",
    129: "photo-1542272604-787c3835535d",
    130: "photo-1542272604-787c3835535d",
    131: "photo-1556821840-3a63f95609a7",
    132: "photo-1620799140408-edc6dcb6d633",
    133: "photo-1578681994506-b8f463449011",
    134: "photo-1551028719-00167b16eac5",
    135: "photo-1551028719-00167b16eac5",
}

def fashion_image_url(product_id):
    photo_id = FASHION_IMAGE_IDS.get(product_id)
    if not photo_id:
        return None
    return f"https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1000&q=85"

def make_product(
    id, name, brand, subcategory, price, description,
    sizes, material, colour, fit, size_chart
):
    return {
        "id": id,
        "name": name,
        "brand": brand,
        "category": "Fashion",
        "subcategory": subcategory,
        "price": price,
        "description": description,
        "available_sizes": sizes,
        "size_chart": size_chart,
        "specifications": {
            "material": material,
            "colour": colour,
            "fit": fit
        },
        # These catalogue rows are synthetic. Reused generic stock photos were
        # not SKU- or colour-accurate, so the UI renders an attribute-coloured
        # illustration instead of showing a misleading product photograph.
        "image": None,
        "image_url": None,
        "image_is_verified": False,
        "is_sample_data": True
    }



fashion_products = [

    # RUNNING SHOES (6)
    make_product(101, "Velocity Runner", "StrideX", "Shoes", 2499,
                 "Lightweight everyday running shoes.",
                 ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
                 "Mesh", "Black", "Regular",
                 {"UK 6": 24, "UK 7": 25, "UK 8": 26,
                  "UK 9": 27, "UK 10": 28}),

    make_product(102, "AirFlex Running Shoes", "StrideX", "Shoes", 3299,
                 "Breathable shoes designed for daily running.",
                 ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
                 "Mesh", "Blue", "Regular",
                 {"UK 6": 24, "UK 7": 25, "UK 8": 26,
                  "UK 9": 27, "UK 10": 28}),

    make_product(103, "Sprint Pro", "RunCraft", "Shoes", 3799,
                 "Cushioned running shoes for everyday workouts.",
                 ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
                 "Engineered Mesh", "Grey", "Regular",
                 {"UK 6": 24, "UK 7": 25, "UK 8": 26,
                  "UK 9": 27, "UK 10": 28}),

    make_product(104, "CloudStep Runner", "RunCraft", "Shoes", 2899,
                 "Comfortable lightweight running shoes.",
                 ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
                 "Mesh", "White", "Regular",
                 {"UK 6": 24, "UK 7": 25, "UK 8": 26,
                  "UK 9": 27, "UK 10": 28}),

    make_product(105, "TrailMove Shoes", "PeakWear", "Shoes", 4199,
                 "Durable shoes for outdoor activities.",
                 ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
                 "Synthetic", "Olive", "Regular",
                 {"UK 6": 24, "UK 7": 25, "UK 8": 26,
                  "UK 9": 27, "UK 10": 28}),

    make_product(106, "FlexRun Lite", "PeakWear", "Shoes", 1999,
                 "Affordable lightweight sports shoes.",
                 ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
                 "Mesh", "Navy", "Regular",
                 {"UK 6": 24, "UK 7": 25, "UK 8": 26,
                  "UK 9": 27, "UK 10": 28}),

    # SNEAKERS (6)
    make_product(107, "Street Classic", "UrbanStep", "Sneakers", 2499,
                 "Minimal everyday casual sneakers.",
                 ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
                 "Synthetic Leather", "White", "Regular",
                 {"UK 6": 24, "UK 7": 25, "UK 8": 26,
                  "UK 9": 27, "UK 10": 28}),

    make_product(108, "Retro High Sneakers", "UrbanStep", "Sneakers", 3999,
                 "Retro-inspired casual sneakers.",
                 ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
                 "Synthetic Leather", "Black", "Regular",
                 {"UK 6": 24, "UK 7": 25, "UK 8": 26,
                  "UK 9": 27, "UK 10": 28}),

    make_product(109, "Canvas Street", "StreetLab", "Sneakers", 1599,
                 "Classic canvas shoes for daily wear.",
                 ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
                 "Canvas", "Beige", "Regular",
                 {"UK 6": 24, "UK 7": 25, "UK 8": 26,
                  "UK 9": 27, "UK 10": 28}),

    make_product(110, "Urban Low Tops", "StreetLab", "Sneakers", 2799,
                 "Low-top sneakers with a clean design.",
                 ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
                 "Synthetic", "Black", "Regular",
                 {"UK 6": 24, "UK 7": 25, "UK 8": 26,
                  "UK 9": 27, "UK 10": 28}),

    make_product(111, "Everyday Court", "MotionWay", "Sneakers", 3199,
                 "Court-inspired casual sneakers.",
                 ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
                 "Synthetic Leather", "White", "Regular",
                 {"UK 6": 24, "UK 7": 25, "UK 8": 26,
                  "UK 9": 27, "UK 10": 28}),

    make_product(112, "Classic Suede Sneaker", "MotionWay", "Sneakers", 3599,
                 "Suede-style casual sneakers.",
                 ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
                 "Suede", "Brown", "Regular",
                 {"UK 6": 24, "UK 7": 25, "UK 8": 26,
                  "UK 9": 27, "UK 10": 28}),

    # T-SHIRTS (8)
    make_product(113, "Classic Cotton Tee", "Urban Basics", "T-Shirts", 599,
                 "Everyday cotton T-shirt.",
                 ["S", "M", "L", "XL", "XXL"], "Cotton", "White",
                 "Regular",
                 {"S": {"chest": 92, "waist": 88},
                  "M": {"chest": 98, "waist": 94},
                  "L": {"chest": 104, "waist": 100},
                  "XL": {"chest": 110, "waist": 106},
                  "XXL": {"chest": 116, "waist": 112}}),

    make_product(114, "Oversized Street Tee", "Urban Basics", "T-Shirts", 899,
                 "Relaxed oversized T-shirt.",
                 ["S", "M", "L", "XL"], "Cotton", "Black", "Oversized",
                 {"S": {"chest": 102, "waist": 100},
                  "M": {"chest": 108, "waist": 106},
                  "L": {"chest": 114, "waist": 112},
                  "XL": {"chest": 120, "waist": 118}}),

    make_product(115, "Essential Crew Neck", "CottonClub", "T-Shirts", 699,
                 "Soft cotton crew-neck T-shirt.",
                 ["S", "M", "L", "XL", "XXL"], "Cotton", "Navy",
                 "Regular",
                 {"S": {"chest": 92, "waist": 88},
                  "M": {"chest": 98, "waist": 94},
                  "L": {"chest": 104, "waist": 100},
                  "XL": {"chest": 110, "waist": 106},
                  "XXL": {"chest": 116, "waist": 112}}),

    make_product(116, "Graphic Print Tee", "CottonClub", "T-Shirts", 799,
                 "Casual graphic-print T-shirt.",
                 ["S", "M", "L", "XL"], "Cotton", "Grey", "Regular",
                 {"S": {"chest": 92, "waist": 88},
                  "M": {"chest": 98, "waist": 94},
                  "L": {"chest": 104, "waist": 100},
                  "XL": {"chest": 110, "waist": 106}}),

    make_product(117, "Performance Dry Tee", "MotionWay", "T-Shirts", 999,
                 "Quick-dry T-shirt for workouts.",
                 ["S", "M", "L", "XL"], "Polyester", "Black", "Athletic",
                 {"S": {"chest": 92, "waist": 88},
                  "M": {"chest": 98, "waist": 94},
                  "L": {"chest": 104, "waist": 100},
                  "XL": {"chest": 110, "waist": 106}}),

    make_product(118, "Minimal Logo Tee", "StreetLab", "T-Shirts", 749,
                 "Minimal everyday logo T-shirt.",
                 ["S", "M", "L", "XL"], "Cotton", "Olive", "Regular",
                 {"S": {"chest": 92, "waist": 88},
                  "M": {"chest": 98, "waist": 94},
                  "L": {"chest": 104, "waist": 100},
                  "XL": {"chest": 110, "waist": 106}}),

    make_product(119, "Heavyweight Boxy Tee", "StreetLab", "T-Shirts", 1199,
                 "Structured heavyweight boxy T-shirt.",
                 ["S", "M", "L", "XL"], "Heavy Cotton", "Cream", "Boxy",
                 {"S": {"chest": 100, "waist": 96},
                  "M": {"chest": 106, "waist": 102},
                  "L": {"chest": 112, "waist": 108},
                  "XL": {"chest": 118, "waist": 114}}),

    make_product(120, "Striped Casual Tee", "PeakWear", "T-Shirts", 849,
                 "Casual striped cotton T-shirt.",
                 ["S", "M", "L", "XL"], "Cotton", "Blue", "Regular",
                 {"S": {"chest": 92, "waist": 88},
                  "M": {"chest": 98, "waist": 94},
                  "L": {"chest": 104, "waist": 100},
                  "XL": {"chest": 110, "waist": 106}}),

    # SHIRTS (5)
    make_product(121, "Oxford Casual Shirt", "CottonClub", "Shirts", 1499,
                 "Smart casual cotton shirt.",
                 ["S", "M", "L", "XL"], "Cotton", "Light Blue", "Regular",
                 {"S": {"chest": 94, "waist": 86},
                  "M": {"chest": 100, "waist": 92},
                  "L": {"chest": 106, "waist": 98},
                  "XL": {"chest": 112, "waist": 104}}),

    make_product(122, "Linen Summer Shirt", "Urban Basics", "Shirts", 1799,
                 "Lightweight shirt for warm weather.",
                 ["S", "M", "L", "XL"], "Linen Blend", "Beige", "Relaxed",
                 {"S": {"chest": 96, "waist": 90},
                  "M": {"chest": 102, "waist": 96},
                  "L": {"chest": 108, "waist": 102},
                  "XL": {"chest": 114, "waist": 108}}),

    make_product(123, "Checked Flannel Shirt", "StreetLab", "Shirts", 1599,
                 "Casual checked shirt.",
                 ["S", "M", "L", "XL"], "Cotton", "Red", "Regular",
                 {"S": {"chest": 94, "waist": 86},
                  "M": {"chest": 100, "waist": 92},
                  "L": {"chest": 106, "waist": 98},
                  "XL": {"chest": 112, "waist": 104}}),

    make_product(124, "Formal Slim Shirt", "MotionWay", "Shirts", 1899,
                 "Slim-fit shirt for formal occasions.",
                 ["S", "M", "L", "XL"], "Cotton Blend", "White", "Slim",
                 {"S": {"chest": 92, "waist": 84},
                  "M": {"chest": 98, "waist": 90},
                  "L": {"chest": 104, "waist": 96},
                  "XL": {"chest": 110, "waist": 102}}),

    make_product(125, "Denim Casual Shirt", "PeakWear", "Shirts", 1999,
                 "Versatile denim casual shirt.",
                 ["S", "M", "L", "XL"], "Denim", "Dark Blue", "Regular",
                 {"S": {"chest": 94, "waist": 86},
                  "M": {"chest": 100, "waist": 92},
                  "L": {"chest": 106, "waist": 98},
                  "XL": {"chest": 112, "waist": 104}}),

    # JEANS AND TROUSERS (5)
    make_product(126, "Slim Fit Denim", "Urban Basics", "Jeans", 1799,
                 "Everyday slim-fit denim jeans.",
                 ["28", "30", "32", "34", "36"], "Denim", "Dark Blue",
                 "Slim",
                 {"28": {"waist": 71}, "30": {"waist": 76},
                  "32": {"waist": 81}, "34": {"waist": 86},
                  "36": {"waist": 91}}),

    make_product(127, "Relaxed Fit Jeans", "StreetLab", "Jeans", 1999,
                 "Relaxed casual denim jeans.",
                 ["28", "30", "32", "34", "36"], "Denim", "Black",
                 "Relaxed",
                 {"28": {"waist": 71}, "30": {"waist": 76},
                  "32": {"waist": 81}, "34": {"waist": 86},
                  "36": {"waist": 91}}),

    make_product(128, "Straight Fit Denim", "CottonClub", "Jeans", 1899,
                 "Classic straight-fit denim.",
                 ["28", "30", "32", "34", "36"], "Denim", "Blue",
                 "Straight",
                 {"28": {"waist": 71}, "30": {"waist": 76},
                  "32": {"waist": 81}, "34": {"waist": 86},
                  "36": {"waist": 91}}),

    make_product(129, "Everyday Chinos", "MotionWay", "Trousers", 1599,
                 "Smart casual cotton-blend chinos.",
                 ["28", "30", "32", "34", "36"], "Cotton Blend",
                 "Khaki", "Slim",
                 {"28": {"waist": 71}, "30": {"waist": 76},
                  "32": {"waist": 81}, "34": {"waist": 86},
                  "36": {"waist": 91}}),

    make_product(130, "Relaxed Cargo Pants", "PeakWear", "Trousers", 2199,
                 "Utility-style relaxed cargo trousers.",
                 ["28", "30", "32", "34", "36"], "Cotton", "Olive",
                 "Relaxed",
                 {"28": {"waist": 71}, "30": {"waist": 76},
                  "32": {"waist": 81}, "34": {"waist": 86},
                  "36": {"waist": 91}}),

    # HOODIES AND JACKETS (5)
    make_product(131, "Classic Pullover Hoodie", "Urban Basics",
                 "Hoodies", 1799, "Soft everyday pullover hoodie.",
                 ["S", "M", "L", "XL"], "Fleece", "Black", "Regular",
                 {"S": {"chest": 100, "waist": 96},
                  "M": {"chest": 106, "waist": 102},
                  "L": {"chest": 112, "waist": 108},
                  "XL": {"chest": 118, "waist": 114}}),

    make_product(132, "Oversized Graphic Hoodie", "StreetLab",
                 "Hoodies", 2299, "Oversized graphic hoodie.",
                 ["S", "M", "L", "XL"], "Cotton Fleece", "Grey",
                 "Oversized",
                 {"S": {"chest": 106, "waist": 102},
                  "M": {"chest": 112, "waist": 108},
                  "L": {"chest": 118, "waist": 114},
                  "XL": {"chest": 124, "waist": 120}}),

    make_product(133, "Zip-Up Hoodie", "MotionWay", "Hoodies", 1999,
                 "Versatile full-zip hoodie.",
                 ["S", "M", "L", "XL"], "Fleece", "Navy", "Regular",
                 {"S": {"chest": 100, "waist": 96},
                  "M": {"chest": 106, "waist": 102},
                  "L": {"chest": 112, "waist": 108},
                  "XL": {"chest": 118, "waist": 114}}),

    make_product(134, "Lightweight Bomber Jacket", "PeakWear",
                 "Jackets", 2799, "Lightweight everyday bomber jacket.",
                 ["S", "M", "L", "XL"], "Polyester", "Olive", "Regular",
                 {"S": {"chest": 100, "waist": 96},
                  "M": {"chest": 106, "waist": 102},
                  "L": {"chest": 112, "waist": 108},
                  "XL": {"chest": 118, "waist": 114}}),

    make_product(135, "Denim Trucker Jacket", "UrbanStep",
                 "Jackets", 2999, "Classic denim trucker jacket.",
                 ["S", "M", "L", "XL"], "Denim", "Blue", "Regular",
                 {"S": {"chest": 100, "waist": 96},
                  "M": {"chest": 106, "waist": 102},
                  "L": {"chest": 112, "waist": 108},
                  "XL": {"chest": 118, "waist": 114}})
]


# ---------------------------------------------------------
# SYNTHETIC DEMO BUNDLE DATA
# These are illustrative add-on suggestions, not verified
# retailer bundles or manufacturer-confirmed compatibility.
# ---------------------------------------------------------

_HOODIE_BUNDLE = [
    {
        "name": "Relaxed Fit Joggers",
        "price": 999,
        "currency": "INR",
        "type": "recommended",
        "compatibility_status": "unknown",
        "reason": "Style-complementary clothing suggestion; colour and size coordination are not verified.",
    },
    {
        "name": "Everyday Baseball Cap",
        "price": 499,
        "currency": "INR",
        "type": "optional",
        "compatibility_status": "unknown",
        "reason": "Optional outfit accessory; style match is subjective and not verified.",
    },
]

for _product in fashion_products:
    _category = str(_product.get("category", "")).lower()
    _name = str(_product.get("name", "")).lower()

    if _category in ("hoodies", "hoodie") or "hoodie" in _name:
        _product["recommended_accessories"] = [dict(item) for item in _HOODIE_BUNDLE]
        _product["included_accessories"] = []
