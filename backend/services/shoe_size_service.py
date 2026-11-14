
import math


def recommend_shoe_size(product, foot_length_cm=None):
    """
    Recommend shoe size using the product's supplied foot-length chart.

    foot_length_cm:
        Measured foot length in centimetres.

    Only sizes listed as available are considered.
    Regional conversions are displayed only when supplied by the chart.
    """

    product_name = product.get("name", "Unknown product")
    brand = product.get("brand", "Unknown")

    # 1. Validate foot measurement
    if foot_length_cm is None:
        return {
            "status": "measurement_required",
            "missing_measurements": ["foot_length_cm"],
            "message": "Please provide your foot length in centimetres."
        }

    if isinstance(foot_length_cm, bool):
        return {
            "status": "error",
            "message": "Foot length must be a valid positive number."
        }

    try:
        foot_length_cm = float(foot_length_cm)

        if not math.isfinite(foot_length_cm) or foot_length_cm <= 0:
            raise ValueError

    except (TypeError, ValueError):
        return {
            "status": "error",
            "message": "Foot length must be a valid positive number."
        }

    # 2. Read product size information
    size_chart = product.get("size_chart", {})
    available_sizes = product.get("available_sizes", [])

    if not isinstance(size_chart, dict) or not size_chart:
        return {
            "status": "error",
            "message": "Shoe size chart is unavailable."
        }

    if not isinstance(available_sizes, (list, tuple, set)):
        return {
            "status": "error",
            "message": "Available shoe size information is invalid."
        }

    if not available_sizes:
        return {
            "status": "error",
            "message": "No shoe sizes are currently listed as available."
        }

    available_sizes = {
        str(size).strip()
        for size in available_sizes
    }

    # 3. Keep only valid available chart entries
    valid_sizes = {}

    for size, chart_entry in size_chart.items():

        if str(size).strip() not in available_sizes:
            continue

        # Support either:
        # "UK 8": 26.5
        # "UK 8": {"foot_length_cm": 26.5, "EU": 42}
        if isinstance(chart_entry, dict):
            length = chart_entry.get("foot_length_cm")
            regional_sizes = {
                key: value
                for key, value in chart_entry.items()
                if key != "foot_length_cm"
            }
        else:
            length = chart_entry
            regional_sizes = {}

        if isinstance(length, bool):
            continue

        try:
            length = float(length)

            if not math.isfinite(length) or length <= 0:
                continue

        except (TypeError, ValueError):
            continue

        valid_sizes[str(size).strip()] = {
            "foot_length_cm": length,
            "regional_sizes": regional_sizes
        }

    if not valid_sizes:
        return {
            "status": "error",
            "message": (
                "No valid available shoe sizes were found "
                "in the supplied size chart."
            )
        }

    # 4. Find closest available size
    recommended_size = min(
        valid_sizes,
        key=lambda size: abs(
            valid_sizes[size]["foot_length_cm"] - foot_length_cm
        )
    )

    selected_entry = valid_sizes[recommended_size]

    chart_length = selected_entry["foot_length_cm"]

    difference = abs(chart_length - foot_length_cm)

    # 5. Check whether measurement is within chart range
    all_lengths = [
        entry["foot_length_cm"]
        for entry in valid_sizes.values()
    ]

    minimum_length = min(all_lengths)
    maximum_length = max(all_lengths)

    outside_chart = not (
        minimum_length <= foot_length_cm <= maximum_length
    )

    if outside_chart:
        confidence = "low"
        fit_note = (
            "Your foot length falls outside the available size-chart "
            "range. The closest available size may not be suitable."
        )

    elif difference <= 0.3:
        confidence = "high"
        fit_note = (
            "Your foot length is close to the selected chart value."
        )

    elif difference <= 0.7:
        confidence = "medium"
        fit_note = (
            "This is the closest available size, but check the "
            "manufacturer's fit guidance."
        )

    else:
        confidence = "low"
        fit_note = (
            "The measurement difference is relatively large. "
            "Consider checking another size chart."
        )

    # 6. Return regional sizes only when explicitly supplied
    regional_sizes = selected_entry["regional_sizes"]

    return {
        "status": "success",
        "product": product_name,
        "brand": brand,
        "foot_length_cm": round(foot_length_cm, 2),
        "recommended_size": recommended_size,
        "regional_sizes": regional_sizes,
        "chart_foot_length_cm": chart_length,
        "measurement_difference_cm": round(difference, 2),
        "chart_range_cm": {
            "minimum": minimum_length,
            "maximum": maximum_length
        },
        "outside_chart_range": outside_chart,
        "confidence": confidence,
        "is_sample_data": product.get("is_sample_data", False),
        "message": (
            f"Closest available shoe size for {product_name}: "
            f"{recommended_size}. {fit_note}"
        )
    }
