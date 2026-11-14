"""Compatibility specialist: evaluates only supplied catalogue evidence."""
from backend.services.compatibility import check_compatibility


def run_compatibility_agent(product, user_device=None):
    if not user_device:
        return {
            "agent": "Compatibility Agent",
            "status": "not_applicable",
            "message": "No target device was provided.",
            "data": {
                "status": "not_applicable", "compatible": None, "device": None,
                "confidence": "none", "evidence": [],
                "message": "No target device was provided.",
            },
        }
    try:
        result = check_compatibility(product, user_device)
        if not isinstance(result, dict):
            raise TypeError("Compatibility service returned an invalid response.")
        result.setdefault("device", user_device)
        result.setdefault("evidence", [])
        return {
            "agent": "Compatibility Agent",
            "status": result.get("status", "unknown"),
            "message": result.get("message", "Compatibility analysis completed."),
            "data": result,
        }
    except Exception as exc:
        data = {
            "status": "error", "compatible": None, "device": user_device,
            "confidence": "none", "evidence": [],
            "message": f"Compatibility could not be evaluated: {exc}",
        }
        return {
            "agent": "Compatibility Agent", "status": "error",
            "message": data["message"], "data": data,
        }
