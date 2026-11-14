"""Decision specialist: deterministic, evidence-led product ranking."""
from backend.agent.shopping_agent import compare_products


def run_decision_agent(products, user_request, search_parameters):
    try:
        data = compare_products(products, user_request, search_parameters)
        if not isinstance(data, dict):
            raise TypeError("Decision engine returned an invalid response.")
        selected = data.get("selected_product")
        status = "completed" if selected else "no_results"
        return {
            "agent": "Decision Agent",
            "status": status,
            "message": (
                f"Ranked {len(data.get('ranked_products') or [])} candidates."
                if selected else "No product could be selected from the candidates."
            ),
            "data": data,
        }
    except Exception as exc:
        data = {"status": "error", "selected_product": None,
                "winner_score": 0, "comparison_reason": str(exc),
                "compared_factors": [], "ranked_products": []}
        return {"agent": "Decision Agent", "status": "error",
                "message": str(exc), "data": data}
