"""Flask API for MUSE AI shopping assistant."""
from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from backend.agent.shopping_agent import run_shopping_agent
from backend.integrations.shopping_api import _catalogue_products
from backend.services.compatibility import check_compatibility
from backend.services.bundle_service import generate_bundle
from backend.services.fashion_service import recommend_size
from backend.services.review_service import analyze_reviews

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False
FRONTEND_DIST = BASE_DIR / "frontend-react" / "dist"
allowed_origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if origin.strip()]
CORS(app, resources={r"/api/*": {"origins": allowed_origins}})


@app.get("/")
def frontend_index():
    index_file = FRONTEND_DIST / "index.html"
    if index_file.is_file():
        return send_from_directory(FRONTEND_DIST, "index.html")
    return jsonify({
        "project": "MUSE AI",
        "message": "Backend is running. Start the React frontend with `cd frontend-react && npm run dev`.",
        "api_health": "/api/health",
    })


@app.get("/<path:asset_path>")
def frontend_assets(asset_path):
    requested_file = FRONTEND_DIST / asset_path
    if requested_file.is_file():
        return send_from_directory(FRONTEND_DIST, asset_path)
    index_file = FRONTEND_DIST / "index.html"
    if index_file.is_file() and not asset_path.startswith("api/"):
        return send_from_directory(FRONTEND_DIST, "index.html")
    return jsonify({"status": "error", "message": "Route not found."}), 404


def _find_product(product_id):
    return next((p for p in _catalogue_products() if str(p.get("id")) == str(product_id)), None)


@app.get("/api/health")
def health():
    return jsonify({
        "project": "MUSE AI",
        "status": "online",
        "services": {
            "catalogue": "ready",
            "product_data": "bundled_mock_only",
            "external_product_apis": "disabled",
            "live_prices": "disabled",
            "groq": "configured" if os.getenv("GROQ_API_KEY") else "not_configured_optional",
            "authentication": "browser_demo_only",
        },
        "message": "MUSE backend is running with bundled synthetic mock data only.",
    })


@app.get("/api/products")
def get_products():
    # Store catalogue intentionally includes every local demo catalogue, not only core electronics.
    catalogue = _catalogue_products()
    return jsonify({"status": "success", "total_products": len(catalogue), "products": catalogue})


@app.post("/api/search")
def search():
    data = request.get_json(silent=True) or {}
    shopping_request = data.get("request", "")
    if not isinstance(shopping_request, str) or not shopping_request.strip():
        return jsonify({"status": "error", "message": "Shopping request cannot be empty."}), 400
    if len(shopping_request) > 1000:
        return jsonify({"status": "error", "message": "Please keep the shopping request under 1,000 characters."}), 400
    try:
        result = run_shopping_agent(shopping_request.strip())
        return jsonify({"status": "success", "request": shopping_request.strip(), "recommendation": result})
    except ValueError as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    except Exception:
        app.logger.exception("MUSE shopping workflow failed")
        return jsonify({"status": "error", "message": "MUSE could not complete this search. Check backend logs and integration configuration."}), 500


@app.post("/api/compatibility")
def compatibility():
    data = request.get_json(silent=True) or {}
    product = _find_product(data.get("product_id"))
    device = str(data.get("device") or "").strip()
    if not product:
        return jsonify({"status": "error", "message": "A valid product_id is required."}), 404
    if not device:
        return jsonify({"status": "error", "message": "Device name is required."}), 400
    return jsonify({"status": "success", "result": check_compatibility(product, device)})


@app.post("/api/bundle")
def bundle():
    data = request.get_json(silent=True) or {}
    product = _find_product(data.get("product_id"))
    if not product:
        return jsonify({"status": "error", "message": "A valid product_id is required."}), 404
    return jsonify({"status": "success", "bundle": generate_bundle(product)})


@app.post("/api/fashion/recommend-size")
def fashion():
    data = request.get_json(silent=True) or {}
    try:
        brand = str(data.get("brand") or "").strip()
        category = str(data.get("category") or "").strip()
        chest = float(data.get("chest"))
        waist = float(data.get("waist"))
        if not brand or not category or chest <= 0 or waist <= 0:
            raise ValueError
    except (TypeError, ValueError):
        return jsonify({"status": "error", "message": "Provide a brand, category, chest and waist measurement as positive values."}), 400
    result = recommend_size(brand, category, chest, waist)
    return jsonify(result), (200 if result.get("status") == "success" else 404)


@app.get("/api/reviews/<int:product_id>")
def reviews(product_id):
    result = analyze_reviews(product_id)
    return jsonify(result), (200 if result.get("status") == "success" else 404)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5050")), debug=os.getenv("FLASK_DEBUG", "false").lower() == "true")
