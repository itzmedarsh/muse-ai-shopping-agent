discovery_products = [
    {
        "id": 101,
        "name": "Nike Revolution 7 Running Shoes",
        "brand": "Nike",
        "category": "Fashion",
        "price": 3499,
        "specifications": {
            "type": "Running Shoes",
            "color": "Black",
            "material": "Mesh",
            "size": "UK 8"
        },
        "availability": "In Stock",
        "available_sizes": ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
        "size_chart": {"UK 6": 24, "UK 7": 25, "UK 8": 26, "UK 9": 27, "UK 10": 28},
        "is_sample_data": True,
        "image": "https://classic.cdn.media.amplience.net/i/hibbett/0847H_0001_main"
    },
    {
        "id": 102,
        "name": "Adidas Runfalcon 3.0",
        "brand": "Adidas",
        "category": "Fashion",
        "price": 2999,
        "specifications": {
            "type": "Running Shoes",
            "color": "Blue",
            "material": "Mesh",
            "size": "UK 8"
        },
        "availability": "In Stock",
        "available_sizes": ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
        "size_chart": {"UK 6": 24, "UK 7": 25, "UK 8": 26, "UK 9": 27, "UK 10": 28},
        "is_sample_data": True,
        "image": "https://assets.adidas.com/images/w_600,f_auto,q_auto/543c5c5fdef94230a3deeaf1c01f1227_9366/Runfalcon_3.0_Shoes_Blue_IE0735_01_standard.jpg"
    },
    {
    "id": 103,
    "name": "Sony WH-CH520 Wireless Headphones",
    "brand": "Sony",
    "category": "Audio",
    "price": 3999,
    "specifications": {
        "type": "Wireless Headphones",
        "connection": "Bluetooth",
        "battery_life": "50 hours"
    },
    "compatible_devices": [
        "iPhone",
        "iPhone 15 Pro Max",
        "Android phones",
        "MacBook",
        "Windows laptops"
    ],
    "availability": "In Stock",
    "image": "https://s13emagst.akamaized.net/products/53458/53457332/images/res_64cc3ef89a16222a64d98161215c6243.jpg"
},
    {
        "id": 104,
        "name": "Philips Air Fryer HD9200",
        "brand": "Philips",
        "category": "Home Appliances",
        "price": 6999,
        "specifications": {
            "capacity": "4.1L",
            "power": "1400W",
            "type": "Air Fryer"
        },
        "availability": "In Stock",
        "image": "https://images.philips.com/is/image/philipsconsumer/vrs_dea414b3_1cb4_4b84_9b4dcf797315caca?$pnglarge$=&hei=700&wid=700"
    },
    {
        "id": 105,
        "name": "Prestige Electric Kettle",
        "brand": "Prestige",
        "category": "Home Appliances",
        "price": 1499,
        "specifications": {
            "capacity": "1.5L",
            "power": "1500W",
            "type": "Electric Kettle"
        },
        "availability": "In Stock",
        "image": "https://shop.ttkprestige.com/media/catalog/product/8/4/8426-41884-IMG1.jpg?fit=bounds&height=500&optimize=medium&width=500"
    },
    {
        "id": 106,
        "name": "Logitech K380 Wireless Keyboard",
        "brand": "Logitech",
        "category": "Accessories",
        "price": 2999,
        "specifications": {
            "connection": "Bluetooth",
            "type": "Wireless Keyboard",
            "compatibility": "Windows, macOS, Android, iPadOS"
        },
        "availability": "In Stock",
        "image": "https://resource.logitech.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/multi-keyboard-k380/gallery/k380-sand-gallery-1-us.png"
    }
]

# ---------------------------------------------------------
# SYNTHETIC DEMO BUNDLE DATA — Sony WH-CH520 (ID 103)
# These are illustrative catalogue entries, not live listings.
# ---------------------------------------------------------

for product in discovery_products:
    if product.get("id") == 103:
        product["included_accessories"] = []

        product["recommended_accessories"] = [
            {
                "name": "Universal USB-C Charging Cable",
                "price": 399,
                "currency": "INR",
                "type": "essential",
                "compatibility_status": "confirmed",
                "compatible": True,
                "reason": (
                    "USB-C charging accessory listed for this "
                    "synthetic demo bundle."
                ),
            },
            {
                "name": "Universal Headphone Stand",
                "price": 499,
                "currency": "INR",
                "type": "recommended",
                "compatibility_status": "confirmed",
                "compatible": True,
                "reason": (
                    "A general-purpose stand for storing headphones."
                ),
            },
            {
                "name": "Compact Headphone Carry Pouch",
                "price": 299,
                "currency": "INR",
                "type": "optional",
                "compatibility_status": "unknown",
                "compatible": None,
                "reason": (
                    "Optional carrying accessory. Exact fit has "
                    "not been verified."
                ),
            },
        ]

        product["is_sample_data"] = True
        break

