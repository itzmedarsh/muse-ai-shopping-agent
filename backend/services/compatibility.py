
def check_compatibility(product, user_device):
    """
    Check whether a product supports the user's device.
    """

    compatible_devices = product.get("compatible_devices", [])

    user_device = user_device.lower().strip()

    for device in compatible_devices:

        if user_device == device.lower():
            return {
                "compatible": True,
                "product": product["name"],
                "user_device": user_device,
                "message": f"{product['name']} is compatible with {user_device}."
            }

    return {
        "compatible": False,
        "product": product["name"],
        "user_device": user_device,
        "message": f"{product['name']} is not confirmed compatible with {user_device}."
    }
