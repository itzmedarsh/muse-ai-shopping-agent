"""Discovery specialist for MUSE's local synthetic catalogue."""
from backend.integrations.shopping_api import discover_products


def run_discovery_agent(search_parameters):
    params = dict(search_parameters or {})
    requested = params.get("requested_items") or []
    if len(requested) >= 2:
        # Keep every requested product family available to the bundle builder.
        result = discover_products(query="", limit=300)
    else:
        result = discover_products(**params)
    if not isinstance(result, dict):
        return {"agent":"Discovery Agent","status":"error","message":"Product discovery returned an invalid response.","data":{"products":[],"external_products":[]}}
    local = result.get("products") or []
    external = result.get("external_products") or []
    return {"agent":"Discovery Agent","status":"completed" if local or external else "no_results",
            "message":f"Found {len(local) + len(external)} products across configured sources.","data":result}
