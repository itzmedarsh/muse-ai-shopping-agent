"""Review specialist: analyses only review records present for the selected product."""
from backend.services.review_service import analyze_reviews


def run_review_agent(product_id, is_local_demo=False):
    if not is_local_demo:
        data = {
            "status": "unavailable",
            "is_sample_data": False,
            "total_reviews": 0,
            "positive_count": 0,
            "negative_count": 0,
            "neutral_count": 0,
            "positive_reviews": [],
            "negative_reviews": [],
            "neutral_reviews": [],
            "sentiment_score": None,
            "overall_sentiment": "unavailable",
            "sentiment_distribution": {},
            "positive_highlights": [],
            "recurring_complaints": [],
            "aspect_analysis": {},
            "review_details": [],
            "analysis_method": None,
            "message": "Review records are not available for this external product.",
        }
        return {"agent": "Review Agent", "status": "unavailable",
                "message": data["message"], "data": data}
    try:
        data = analyze_reviews(product_id)
        if not isinstance(data, dict) or not data:
            data = {"status": "unavailable", "total_reviews": 0,
                    "message": "No review records are available for this product."}
        data.setdefault("status", "completed" if data.get("total_reviews") else "unavailable")
        data["is_sample_data"] = bool(data.get("total_reviews"))
        return {"agent": "Review Agent", "status": data["status"],
                "message": data.get("message", "Review analysis completed."),
                "data": data}
    except Exception as exc:
        data = {"status": "error", "total_reviews": 0,
                "message": f"Review analysis failed: {exc}"}
        return {"agent": "Review Agent", "status": "error",
                "message": data["message"], "data": data}
