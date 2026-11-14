"""Product-specific clothing size estimation using supplied catalogue charts."""


def recommend_clothing_size(product, chest=None, waist=None, measurements=None):
    chart = product.get("size_chart") or {}
    available = product.get("available_sizes") or list(chart.keys())
    if not isinstance(chart, dict) or not chart:
        return {
            "status": "chart_unavailable",
            "message": "This product does not have a usable clothing size chart. Use your usual size as a preference and check the seller's size guide.",
            "recommended_size": None,
            "available_sizes": available,
        }
    supplied = measurements or {"chest": chest, "waist": waist}
    supplied = {key: float(value) for key, value in supplied.items() if value is not None}
    if not supplied:
        return {"status": "measurement_required", "message": "Provide chest or waist measurement in centimetres.", "missing_measurements": ["chest_or_waist"]}
    candidates = []
    for size, dimensions in chart.items():
        if str(size) not in {str(value) for value in available} or not isinstance(dimensions, dict):
            continue
        differences = []
        for dimension, value in supplied.items():
            chart_value = dimensions.get(dimension)
            if chart_value is not None:
                differences.append(abs(float(value) - float(chart_value)))
        if differences:
            candidates.append((sum(differences) / len(differences), str(size)))
    if not candidates:
        return {"status": "chart_unavailable", "message": "The product size chart does not contain the measurements supplied.", "recommended_size": None, "available_sizes": available}
    difference, size = min(candidates)
    return {
        "status": "success", "recommended_size": size,
        "measurement_difference_cm": round(difference, 1),
        "confidence": "higher" if difference <= 2 else "moderate" if difference <= 5 else "low",
        "available_sizes": available,
        "message": f"Based on the supplied measurements and this product's chart, the closest listed size is {size}. Check the seller's fit notes before ordering.",
        "is_sample_data": bool(product.get("is_sample_data", True)),
    }


def recommend_size(brand, category, chest, waist):
    """Legacy API adapter retained for the existing /api/fashion/recommend-size route."""
    from backend.data.clothing import clothing_size_charts
    brand = str(brand or "").lower().strip()
    category = str(category or "").lower().strip()
    if brand not in clothing_size_charts or category not in clothing_size_charts[brand]:
        return {"status": "error", "message": "Brand/category size chart not available."}
    chart = clothing_size_charts[brand][category]
    product = {"size_chart": chart, "available_sizes": list(chart.keys())}
    return recommend_clothing_size(product, chest=chest, waist=waist)
