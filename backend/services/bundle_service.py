
def generate_bundle(product):
    """
    Generate a product bundle using recommended accessories.
    """

    bundle_items = []

    # Add the main product
    bundle_items.append({
        "name": product["name"],
        "price": product["price"],
        "type": "main_product"
    })

    included = [
        item.lower()
        for item in product.get("included_accessories", [])
    ]

    accessory_total = 0

    # Check recommended accessories
    for accessory in product.get("recommended_accessories", []):

        accessory_name = accessory["name"]

        # Avoid recommending something already included
        if accessory_name.lower() in included:
            continue

        bundle_items.append({
            "name": accessory_name,
            "price": accessory["price"],
            "type": accessory.get("type", "optional"),
            "reason": accessory.get("reason", "")
        })

        accessory_total += accessory["price"]

    total_price = product["price"] + accessory_total

    return {
        "product": product["name"],
        "items": bundle_items,
        "total_price": total_price,
        "included_accessories": product.get("included_accessories", [])
    }
