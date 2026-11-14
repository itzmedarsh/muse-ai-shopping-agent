
products = [
    {
        "id": 1,
        "name": "Samsung T7 Portable SSD",
        "brand": "Samsung",
        "category": "Storage",
        "price": 5499,
        "specifications": {
            "capacity": "1TB",
            "interface": "USB 3.2 Gen 2",
            "read_speed": "Up to 1050 MB/s",
            "connection": "USB-C"
        },
        "compatible_devices": ["MacBook M1", "Windows laptops"],
        "availability": "In Stock",
        "included_accessories": ["USB-C to USB-C cable"],
        "image": "https://images.samsung.com/is/image/samsung/in-portable-ssd-t7-non-touch-mu-pc1t0t-ww-frontgray-260234762?$1164_776_PNG$=",
        "recommended_accessories": [
            {
                "name": "SSD Protective Case",
                "price": 299,
                "type": "optional",
                "reason": "Protects the SSD while travelling."
            }
            
        ]
    },

    {
        "id": 2,
        "name": "SanDisk Extreme Portable SSD",
        "brand": "SanDisk",
        "category": "Storage",
        "price": 5999,
        "specifications": {
            "capacity": "1TB",
            "interface": "USB 3.2 Gen 2",
            "read_speed": "Up to 1050 MB/s",
            "connection": "USB-C"
        },
        "compatible_devices": ["MacBook M1", "Windows laptops"],
        "availability": "In Stock",
        "included_accessories": ["USB-C cable"],
        "image": "https://www.sandisk.com/content/dam/store/en-us/assets/products/usb-flash-drives/extreme-usb-3-2-ssd/gallery/extreme-usb-3-2-ssd-sky-blue-front.png.wdthumb.1280.1280.png",
        "recommended_accessories": [
            {
                "name": "SSD Protective Case",
                "price": 299,
                "type": "optional",
                "reason": "Provides additional physical protection."
            }
        ]
    },

    {
        "id": 3,
        "name": "Portronics Mport 7C",
        "brand": "Portronics",
        "category": "USB-C Hub",
        "price": 2499,
        "specifications": {
            "ports": ["HDMI", "2 USB-A", "USB-C", "SD Card Reader"],
            "connection": "USB-C",
            "hdmi_resolution": "Up to 4K"
        },
        "compatible_devices": ["MacBook M1", "Windows laptops with USB-C"],
        "availability": "In Stock",
        "included_accessories": ["USB-C hub"],
        "image": "https://www.portronics.com/cdn/shop/products/1200x1200-1_8ffc4f6b-670a-4d74-b3bf-4c3ab550d0d5.jpg?v=1674627390",
        "recommended_accessories": [
            {
                "name": "Laptop Stand",
                "price": 499,
                "type": "optional",
                "reason": "Improves laptop positioning on your desk."
            }
        ]
    },

    {
        "id": 4,
        "name": "Logitech Pebble M350",
        "brand": "Logitech",
        "category": "Mouse",
        "price": 1299,
        "specifications": {
            "connection": "Bluetooth / USB receiver",
            "type": "Wireless",
            "design": "Compact"
        },
        "compatible_devices": ["MacBook M1", "Windows laptops"],
        "image": "https://resource.logitech.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/m350/gallery/m350-sand-gallery-1.png",
        "availability": "In Stock",
        "included_accessories": ["USB receiver", "Battery"],
        "recommended_accessories": []
    }
]

# Fictional MUSE demo products used by the Smart Bundle workflow.
# These are synthetic catalogue records, not real retailer listings or prices.
products.extend([
    {
        "id": 1306,
        "store_id": "mock-1306",
        "name": "MUSE iPhone 13 Mock",
        "brand": "Apple (mock listing)",
        "category": "Electronics",
        "subcategory": "iPhone",
        "price": 39999,
        "currency": "INR",
        "specifications": {
            "type": "iPhone",
            "model": "iPhone 13",
            "operating_system": "iOS",
            "storage": "128GB",
            "color": "Midnight"
        },
        "color": "Midnight",
        "availability": "Demo item",
        "image": "/mock-products/1306.svg",
        "image_url": "/mock-products/1306.svg",
        "source": "muse_mock_catalogue",
        "catalogue_source": "bundled_mock_data",
        "is_sample_data": True,
        "description": "Fictional iPhone demo record with a synthetic price for MUSE testing."
    },
    {
        "id": 1307,
        "store_id": "mock-1307",
        "name": "SonicLab Wireless Headphones Mock",
        "brand": "SonicLab (mock listing)",
        "category": "Audio",
        "subcategory": "Wireless Headphones",
        "price": 1999,
        "currency": "INR",
        "specifications": {
            "type": "Wireless Headphones",
            "connection": "Bluetooth",
            "color": "Black"
        },
        "color": "Black",
        "availability": "Demo item",
        "image": "/mock-products/1307.svg",
        "image_url": "/mock-products/1307.svg",
        "source": "muse_mock_catalogue",
        "catalogue_source": "bundled_mock_data",
        "is_sample_data": True,
        "description": "Fictional wireless headphones demo record with a synthetic price for MUSE testing."
    }
])
