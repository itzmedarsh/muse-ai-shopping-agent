"""Multi-agent coordinator for MUSE AI."""

from datetime import datetime, timezone
import re

from backend.data.reviews import reviews
from backend.integrations.shopping_api import discover_products



from backend.agent.shopping_agent import (

    understand_request,

    empty_review_insights,
    enhance_review_insights,

    unavailable_service,

)

from backend.agent.specialists import (

    run_discovery_agent,

    run_compatibility_agent,

    run_fashion_agent,

    run_review_agent,

    run_bundle_agent,

    run_decision_agent,

)





def _activity(log, agent, status, detail):

    log.append({

        "step": agent,

        "agent": agent,

        "status": status,

        "detail": detail,

        "timestamp": datetime.now(timezone.utc).isoformat(),

    })





def _no_results(search_parameters, discovery, activity, comparison=None):
    comparison = comparison or {}
    comparison_reason = comparison.get("comparison_reason") or (
        "No products with valid INR prices were found in the available catalogue."
    )
    _activity(
        activity, "Shopping Orchestrator", "completed",
        "No verified product match was found; MUSE did not fabricate a recommendation."
    )
    return {
        "summary": comparison_reason,
        "recommended_product": None,
        "product_comparison": {
            "status": comparison.get("status", "not_applicable"),
            "comparison_reason": comparison_reason,
            "compared_factors": comparison.get("compared_factors", []),
            "ranked_products": comparison.get("ranked_products", []),
        },
        "external_discoveries": {
            "source": discovery.get("external_source"),
            "status": discovery.get("external_api_status"),
            "total_results": len(discovery.get("external_products") or []),
            "products": discovery.get("external_products") or [],
        },
        "alternatives": [],
        "category": search_parameters.get("category"),
        "compatibility": unavailable_service("No product was selected."),
        "shoe_size_recommendation": unavailable_service("No product was selected."),
        "clothing_size_recommendation": unavailable_service("No product was selected."),
        "bundle": unavailable_service("No product was selected."),
        "review_insights": empty_review_insights(),
        "reasoning": [
            "The request was interpreted and product discovery was attempted.",
            comparison_reason,
            "MUSE only recommends a product when it meets the detected constraints and has comparable INR pricing.",
        ],
        "needs_user_input": False,
        "follow_up_question": None,
        "agent_activity": activity,
        "search_parameters": search_parameters,
        "data_disclaimer": (
            "Catalogue entries may be sample/demo data. Prices and availability "
            "are not guaranteed to represent live retailer inventory."
        ),
    }


def _initial_size_followup(user_request):
    """Ask for sizing before discovery, so a missing/poor product match cannot skip it."""
    text = str(user_request or "")
    shoe_intent = bool(re.search(
        r"\b(shoes?|sneakers?|footwear|sandals?|boots?)\b", text, re.I
    ))
    apparel_intent = bool(re.search(
        r"\b(clothes?|clothing|apparel|tees?|"
        r"t-?shirts?|shirts?|jeans|trousers?|pants|hoodies?|jackets?|"
        r"sweatshirts?|dresses?|skirts?|shorts)\b", text, re.I
    ))
    has_shoe_measurement = bool(re.search(
        r"\b(?:foot\s*length\s*(?:is|:)?\s*)?\d+(?:\.\d+)?\s*cm\b",
        text, re.I
    ))
    has_clothing_size = bool(re.search(
        r"\b(?:my\s+)?(?:usual\s+)?(?:clothing\s+)?size\s*(?:is|:|=)?\s*"
        r"(XXXL|XXL|XXS|2XL|3XL|XL|XS|[SML])\b|\b(?:i\s+)?(?:usually\s+)?wear\s+"
        r"(XXXL|XXL|XXS|2XL|3XL|XL|XS|[SML])\b", text, re.I
    ))

    if shoe_intent and not has_shoe_measurement:
        return "What is your foot length in centimetres? For example, 26 cm."
    if apparel_intent and not shoe_intent and not has_clothing_size:
        return "What clothing size do you usually wear? (XS, S, M, L, XL or XXL)"
    return None


def _size_question_result(user_request, question):
    activity = []
    _activity(activity, "Shopping Orchestrator", "completed",
              "Detected a clothing/footwear request and paused before discovery to collect sizing.")
    return {
        "original_request": user_request,
        "summary": "One sizing detail will help MUSE personalise this shopping search.",
        "recommended_product": None,
        "product_comparison": {
            "status": "awaiting_user_input",
            "comparison_reason": "Product discovery will continue after sizing is provided.",
            "compared_factors": [],
            "ranked_products": [],
        },
        "external_discoveries": {"source": None, "status": "not_started",
                                 "total_results": 0, "products": []},
        "alternatives": [],
        "category": "fashion",
        "compatibility": unavailable_service("Not evaluated yet."),
        "shoe_size_recommendation": unavailable_service("Sizing input is pending."),
        "clothing_size_recommendation": unavailable_service("Sizing input is pending."),
        "bundle": unavailable_service("Not evaluated yet."),
        "review_insights": empty_review_insights(),
        "reasoning": ["MUSE asks for sizing before product discovery so the question is not dependent on which product is selected."],
        "needs_user_input": True,
        "follow_up_question": question,
        "agent_activity": activity,
        "search_parameters": {"query": user_request, "category": "fashion"},
        "data_disclaimer": "Sizing preference is user-provided. Product-specific fit is only verified when usable sizing information is available.",
    }


def run_multi_agent_shopping(user_request):

    if not isinstance(user_request, str) or not user_request.strip():

        raise ValueError("Please enter a shopping request.")



    # Ask for clothing/shoe sizing before discovery. This avoids depending on
    # whether the product API returns a correctly categorised fashion product.
    initial_question = _initial_size_followup(user_request)
    if initial_question:
        return _size_question_result(user_request, initial_question)

    activity = []

    _activity(activity, "Shopping Orchestrator", "running",

              "Planning the shopping workflow and extracting user constraints.")



# The existing Groq-powered parser is retained as the orchestrator's planning step.

    search_parameters = understand_request(user_request)
    search_parameters["original_request"] = user_request

    # A generic outfit request must be converted into concrete clothing slots
    # before discovery; otherwise the LLM may search for the literal word
    # "outfit" and return no seed product for the bundle specialist.
    if re.search(r"\b(outfit|full look|complete look)\b", user_request, re.I):
        from backend.agent.product_intent import requested_slots
        outfit_slots = requested_slots(user_request)
        search_parameters["requested_items"] = outfit_slots
        search_parameters["primary_item"] = outfit_slots[0] if outfit_slots else "t_shirt"
        search_parameters["category"] = "fashion"
        colour = re.search(
            r"\b(black|white|beige|navy|blue|red|green|olive|grey|gray|brown)\b",
            user_request, re.I
        )
        search_parameters["query"] = (
            f"{colour.group(1).lower()} t-shirt" if colour else "t-shirt"
        )

    _activity(activity, "Shopping Orchestrator", "completed",

              f"Created a plan for: {search_parameters.get('query')}.")



# Agent 1: discovery

    discovery_agent = run_discovery_agent(search_parameters)

    discovery = discovery_agent["data"]

    _activity(activity, "Discovery Agent", discovery_agent["status"],

              discovery_agent["message"])



    local_products = discovery.get("products") or []

    external_products = discovery.get("external_products") or []

    candidates = local_products + external_products



# Keep ranking currency-safe. Never compare mixed currencies or apply an INR
# budget to an unconverted USD price. Without a budget, USD can be used as a
# fallback cohort if INR discovery has no relevant match.
    inr_candidates = []
    usd_candidates = []
    for product in candidates:
        try:
            price = float(product.get("price"))
            currency = str(product.get("currency", "INR")).upper()
            if price < 0:
                continue
            if currency == "INR":
                inr_candidates.append(product)
            elif currency == "USD":
                usd_candidates.append(product)
        except (TypeError, ValueError, OverflowError):
            continue

    has_inr_budget = search_parameters.get("max_price") is not None
    comparable = inr_candidates
    if not comparable and not has_inr_budget:
        comparable = usd_candidates
    if not comparable:
        return _no_results(search_parameters, discovery, activity)

# Agent 2: decision / ranking
    decision_agent = run_decision_agent(comparable, user_request, search_parameters)
    comparison = decision_agent["data"]
    _activity(activity, "Decision Agent", decision_agent["status"], decision_agent["message"])
    selected = comparison.get("selected_product")

    # If local INR rows exist but none satisfy the request, retry in USD only
    # when the user supplied no INR budget. Never mix the two currencies.
    if not selected and not has_inr_budget and comparable is inr_candidates and usd_candidates:
        usd_decision = run_decision_agent(usd_candidates, user_request, search_parameters)
        if usd_decision.get("data", {}).get("selected_product"):
            comparable = usd_candidates
            decision_agent = usd_decision
            comparison = usd_decision["data"]
            selected = comparison.get("selected_product")
            _activity(activity, "Decision Agent", decision_agent["status"],
                      "No relevant INR-priced match was found; ranked the external USD catalogue separately because no INR budget was supplied.")

    if not selected:
        return _no_results(search_parameters, discovery, activity, comparison)


    source = selected.get("source", "unknown")

    local_demo = (
        source in {"synthetic_demo_catalogue", "muse_mock_catalogue"}
        or bool(selected.get("is_sample_data"))
    )

    target_device = search_parameters.get("existing_device")



# Execute only specialists relevant to this selected product/request.
    invoked_agents = ["Shopping Orchestrator", "Discovery Agent", "Decision Agent"]

    target_device = search_parameters.get("existing_device")
    if target_device:
        compatibility_agent = run_compatibility_agent(selected, target_device)
        compatibility = compatibility_agent.get("data") or unavailable_service(
            "Compatibility analysis returned no data."
        )
        _activity(
            activity, "Compatibility Agent", compatibility_agent.get("status", "completed"),
            compatibility_agent.get("message", "Compatibility evaluation finished.")
        )
        invoked_agents.append("Compatibility Agent")
    else:
        compatibility = {
            "status": "not_applicable", "compatible": None, "device": None,
            "confidence": "none", "evidence": [],
            "message": "Skipped: no target device was provided.",
        }
        _activity(activity, "Compatibility Agent", "not_applicable",
                  "Skipped because the request did not mention an existing device.")

    selected_category = str(selected.get("category") or "").strip().lower()
    selected_subcategory = str(selected.get("subcategory") or "").strip().lower()
    fashion_request = bool(re.search(
        r"\b(t-?shirts?|shirts?|jeans|trousers?|hoodies?|jackets?|"
        r"sweatshirts?|dresses?|shorts|shoes?|sneakers?|footwear)\b",
        user_request, re.I
    ))
    is_fashion = (
        selected_category in {"fashion", "clothing", "apparel"}
        or selected_subcategory in {
            "t-shirt", "t-shirts", "shirt", "shirts", "jean", "jeans",
            "trouser", "trousers", "hoodie", "hoodies", "jacket", "jackets",
            "sweatshirt", "sweatshirts", "dress", "dresses", "shorts",
            "shoe", "shoes", "sneaker", "sneakers", "footwear"
        }
        or fashion_request
    )
    if is_fashion:
        fashion_agent = run_fashion_agent(selected, user_request)
        fashion_data = fashion_agent.get("data") or unavailable_service(
            "Fashion fit analysis returned no data."
        )
        _activity(
            activity, "Fashion Fit Agent", fashion_agent.get("status", "completed"),
            fashion_agent.get("message", "Fashion fit evaluation finished.")
        )
        invoked_agents.append("Fashion Fit Agent")
    else:
        fashion_data = {
            "status": "not_applicable",
            "message": "Fashion sizing applies only to apparel and footwear.",
        }
        _activity(activity, "Fashion Fit Agent", "not_applicable",
                  "Skipped because the selected product is not a fashion item.")

    # Generate a bundle only when the user explicitly asks for one or names
    # multiple product types. A single-product search must stay single-product.
    requested_product_types = search_parameters.get("requested_items") or []
    explicit_bundle_intent = bool(re.search(
        r"\b(bundle|complete|full|outfit|set|kit|combo|pair|setup|rig|station)\b",
        user_request, re.I
    ))
    bundle_intent = explicit_bundle_intent or len(requested_product_types) >= 2

    if bundle_intent:
        bundle_catalogue = discover_products(query="", limit=300).get("products", [])
        bundle_agent = run_bundle_agent(
            selected,
            is_local_demo=True,
            user_request=user_request,
            max_price=search_parameters.get("max_price"),
            candidates=bundle_catalogue,
        )
        bundle = bundle_agent.get("data") or unavailable_service(
            "Bundle Agent returned no data."
        )
        # Keep the primary recommendation card consistent with the item
        # chosen for the first explicitly requested product slot.
        bundle_items = bundle.get("items") if isinstance(bundle, dict) else None
        primary_slot = search_parameters.get("primary_item")
        if primary_slot and isinstance(bundle_items, list):
            from backend.agent.product_intent import product_matches_slot
            primary_match = next((item for item in bundle_items
                                  if product_matches_slot(item, primary_slot)), None)
            if primary_match:
                selected = primary_match
                comparison["selected_product"] = selected
        _activity(
            activity, "Bundle Agent", bundle_agent.get("status", "completed"),
            bundle_agent.get("message", "Catalogue-wide bundle analysis finished.")
        )
        invoked_agents.append("Bundle Agent")
    else:
        bundle = {
            "status": "not_applicable",
            "message": "No bundle requested; showing the single recommended product.",
            "items": [],
            "total_price": None,
            "currency": selected.get("currency") or "INR",
            "item_count": 0,
        }
        _activity(
            activity, "Bundle Agent", "not_applicable",
            "Skipped because the user requested one product, not a bundle."
        )

    # Reviews are analysed only when records exist for this exact local product ID.
    try:
        review_key = int(selected.get("id"))
    except (TypeError, ValueError):
        review_key = None
    has_review_data = bool(
        local_demo and review_key is not None and reviews.get(review_key)
    )
    if has_review_data:
        review_agent = run_review_agent(selected.get("id"), is_local_demo=True)
        review_insights = review_agent.get("data") or empty_review_insights()
        review_insights = enhance_review_insights(
            review_insights, selected.get("name") or selected.get("title") or "Selected product"
        )
        _activity(
            activity, "Review Agent", review_agent.get("status", "completed"),
            review_agent.get("message", "Review analysis finished.")
        )
        invoked_agents.append("Review Agent")
    else:
        review_insights = empty_review_insights()
        _activity(activity, "Review Agent", "not_applicable",
                  "Skipped because no review records exist for this exact product.")

    ranked_rows = comparison.get("ranked_products") or []

    selected_id = str(selected.get("id"))

    alternatives = []

    for row in ranked_rows:

        if (str(row.get("id")) == selected_id
                and row.get("store_id") == selected.get("store_id")):
            continue

        ranked_id = str(row.get("id"))
        ranked_name = str(row.get("name") or "").strip().casefold()
        match = next(
            (
                product for product in comparable
                if str(product.get("id")) == ranked_id
                and ranked_name
                and str(product.get("name") or "").strip().casefold() == ranked_name
                and (not row.get("store_id") or product.get("store_id") == row.get("store_id"))
                and (
                    not row.get("source")
                    or product.get("source") == row.get("source")
                )
            ),
            None,
        )
        if match is not None and match not in alternatives:

            alternatives.append(match)



    follow_up = None

    if fashion_data.get("status") == "size_preference_required":
        follow_up = fashion_data.get(
            "message",
            "What clothing size do you usually wear? (XS, S, M, L, XL or XXL)"
        )
    elif fashion_data.get("status") == "measurement_required":
        missing = fashion_data.get("missing_measurements") or []
        if "foot_length_cm" in missing or "foot length" in missing:
            follow_up = fashion_data.get(
                "message",
                "What is your foot length in centimetres? For example, 26 cm."
            )
        else:
            follow_up = fashion_data.get(
                "message",
                "What clothing size do you usually wear? (XS, S, M, L, XL or XXL)"
            )


    category = selected.get("category") or search_parameters.get("category")

    selected_subcategory = str(selected.get("subcategory") or "").lower()

    is_shoe_product = selected_subcategory in {"shoe", "shoes", "sneaker", "sneakers", "footwear"} or (
        selected_category in {"fashion", "clothing", "apparel"}
        and bool(re.search(r"\b(shoes?|sneakers?|footwear)\b", user_request, re.I))
    )

    shoe_size_result = fashion_data if is_shoe_product else unavailable_service("Shoe sizing is not applicable.")

    clothing_size_result = unavailable_service("Clothing sizing is not applicable.") if is_shoe_product else fashion_data

    score = comparison.get("winner_score", 0)

    selected_currency = str(selected.get("currency") or "INR").upper()
    currency_symbol = "₹" if selected_currency == "INR" else "$" if selected_currency == "USD" else f"{selected_currency} "
    summary = (
        f"{selected.get('name', 'The selected product')} is our recommended "
        f"match at approximately {currency_symbol}{float(selected.get('price')):,.2f}."
    )



    # Build transparent, evidence-based reasoning from fields actually present
    # in the catalogue and the deterministic ranking output.
    winner_row = next((row for row in ranked_rows
                       if str(row.get("id")) == str(selected.get("id"))
                       and row.get("store_id") == selected.get("store_id")), {})
    match_reasons = list(winner_row.get("match_reasons") or [])

    def _flat_catalogue_attributes(product):
        attrs = {}
        specs = product.get("specifications")
        if isinstance(specs, dict):
            for key, value in specs.items():
                if value is not None and not isinstance(value, (dict, list)) and str(value).strip():
                    attrs[str(key).replace("_", " ").strip()] = str(value).strip()
        for key in ("brand", "category", "subcategory", "description", "color", "colour"):
            value = product.get(key)
            if value is not None and str(value).strip():
                attrs.setdefault(key.replace("_", " "), str(value).strip())
        return attrs

    selected_attrs = _flat_catalogue_attributes(selected)
    request_lower = user_request.casefold()
    use_cases = []
    for pattern, label in (
        (r"\b(machine learning|\bml\b|deep learning)\b", "machine-learning work"),
        (r"\b(python|programming|coding|software development)\b", "programming"),
        (r"\b(gaming|games)\b", "gaming"),
        (r"\b(video editing|editing|design)\b", "creative work"),
        (r"\b(college|student|classes|study)\b", "college/study use"),
    ):
        if re.search(pattern, request_lower):
            use_cases.append(label)

    requested_specs = []
    spec_aliases = {
        "processor": ("processor", "cpu", "chipset"),
        "RAM": ("ram", "memory"),
        "storage": ("storage", "ssd", "capacity"),
        "graphics": ("gpu", "graphics", "graphics card"),
        "operating system": ("operating system", "os"),
        "battery": ("battery", "battery life"),
        "display": ("display", "screen", "resolution"),
    }
    for label, aliases in spec_aliases.items():
        if any(alias in request_lower for alias in aliases):
            requested_specs.append(label)

    reasoning = [
        "USER REQUIREMENT: " + ("; ".join(use_cases) if use_cases else "product search")
        + (f", with a maximum budget of ₹{float(search_parameters['max_price']):,.0f}."
           if search_parameters.get("max_price") is not None else "."),
        f"PRODUCT SELECTED: {selected.get('name', 'This product')} at {currency_symbol}{float(selected.get('price')):,.2f}.",
        "WHY IT WAS SELECTED: It matches the requested product category ("
        + str(selected.get("subcategory") or selected.get("category") or search_parameters.get("query") or "catalogue category")
        + ") and passed the catalogue ranking filters."
    ]

    if search_parameters.get("max_price") is not None:
        remaining = float(search_parameters["max_price"]) - float(selected.get("price"))
        reasoning.append(
            f"BUDGET CHECK: ₹{float(selected.get('price')):,.0f} is within the ₹{float(search_parameters['max_price']):,.0f} limit, leaving ₹{remaining:,.0f}."
        )

    if selected_attrs:
        # Exclude generic identity fields from the technical-spec summary.
        technical = {k: v for k, v in selected_attrs.items()
                     if k not in {"brand", "category", "subcategory", "description", "color", "colour"}}
        if technical:
            reasoning.append("CATALOGUE EVIDENCE: " + "; ".join(f"{k}: {v}" for k, v in technical.items()) + ".")
        else:
            reasoning.append("CATALOGUE EVIDENCE: The listing contains product identity/category information, but no structured technical specifications.")
    else:
        reasoning.append("CATALOGUE EVIDENCE: No structured technical specifications are available for this listing.")

    if requested_specs:
        present = [label for label in requested_specs
                   if any(alias in key.casefold() for key in selected_attrs for alias in spec_aliases[label])]
        missing = [label for label in requested_specs if label not in present]
        if present:
            reasoning.append("REQUESTED SPECIFICATIONS FOUND: " + ", ".join(present) + ".")
        if missing:
            reasoning.append("UNVERIFIED SPECIFICATIONS: " + ", ".join(missing) + " are not documented in this product's catalogue entry, so MUSE cannot confirm suitability on those points.")
    elif use_cases:
        technical_keys = [key for key in selected_attrs
                          if any(token in key.casefold() for token in ("processor", "cpu", "ram", "memory", "storage", "gpu", "graphics"))]
        if not technical_keys:
            reasoning.append("USE-CASE LIMITATION: The catalogue does not provide processor, RAM, storage or graphics details. MUSE can match the laptop category and budget, but cannot verify that this model is suitable for " + ", ".join(use_cases) + ".")

    if match_reasons:
        # Keep only factual ranking reasons; avoid repeating a vague keyword-match sentence.
        for reason in match_reasons:
            if reason not in reasoning and not reason.casefold().startswith("it also matches prompt details"):
                reasoning.append("RANKING EVIDENCE: " + reason)

    alternative_rows = [row for row in ranked_rows
                        if not (str(row.get("id")) == str(selected.get("id"))
                                and row.get("store_id") == selected.get("store_id"))]
    if alternative_rows:
        best_alternative = alternative_rows[0]
        try:
            alt_price = float(best_alternative.get("price"))
            price_difference = abs(float(selected.get("price")) - alt_price)
            reasoning.append(
                f"ALTERNATIVE: {best_alternative.get('name', 'Another catalogue item')} is ranked next at {currency_symbol}{alt_price:,.2f}, a price difference of ₹{price_difference:,.0f}. "
                "The available catalogue does not document enough technical specifications to claim that the selected model is faster or more capable than this alternative."
            )
        except (TypeError, ValueError):
            reasoning.append(f"ALTERNATIVE: {best_alternative.get('name', 'Another catalogue item')} ranked next, but comparable price/specification evidence is incomplete.")
    else:
        reasoning.append("ALTERNATIVES: No other sufficiently matched catalogue products were available for a reliable comparison.")

    reasoning.append(
        f"MATCH SCORE: {score}/100 is a heuristic catalogue-match score based on available text and constraints; it is not a trained prediction or a measure of real-world performance."
    )
    reasoning.append(
        f"DATA LIMITATION: Evidence source is {source}. MUSE only uses attributes present in the catalogue and does not infer missing specifications or reviews."
    )

    if isinstance(bundle, dict) and bundle.get("status") not in {"not_applicable", "unavailable"}:
        bundle_items = bundle.get("items") or []
        reasoning.append(
            f"BUNDLE CHECK: {len(bundle_items)} of {len(bundle.get('requested_items') or [])} requested categories were matched. Combined catalogue price: {currency_symbol}{float(bundle.get('total_price') or 0):,.2f}."
        )
        for item in bundle_items:
            try:
                item_price = float(item.get("price"))
                reasoning.append(f"BUNDLE ITEM: {item.get('name', 'Product')} at {currency_symbol}{item_price:,.2f}; it matches one of the explicitly requested categories.")
            except (TypeError, ValueError):
                reasoning.append(f"BUNDLE ITEM: {item.get('name', 'Product')}; it matches one of the explicitly requested categories.")
        if bundle.get("status") == "partial":
            reasoning.append("BUNDLE LIMITATION: The bundle is incomplete because these categories could not be fulfilled: " + ", ".join(bundle.get("skipped_items") or []) + ". No unrelated substitutes were added.")
        elif bundle.get("status") == "completed":
            reasoning.append("BUNDLE RESULT: All explicitly requested categories were matched within the stated budget." if bundle.get("budget") is not None else "BUNDLE RESULT: All explicitly requested categories were found in the mock catalogue.")

    if compatibility.get("status") == "confirmed":

        reasoning.append("Compatibility was confirmed using explicit catalogue evidence.")

    elif compatibility.get("status") == "inferred":

        reasoning.append("Compatibility is inferred from available connection information, not certified.")

    elif target_device:

        reasoning.append("Compatibility could not be confirmed from the available product data.")

    if review_insights.get("total_reviews", 0):

        reasoning.append("Review insights were derived from records available for this product.")

    else:

        reasoning.append("No review records were available for the selected product.")



    _activity(activity, "Shopping Orchestrator", "completed",

              "Combined specialist outputs into the final shopping recommendation.")



    return {

        "original_request": user_request,

        "summary": summary,

        "recommended_product": selected,

        "product_comparison": {

            "status": comparison.get("status"),

            "winner_score": comparison.get("winner_score"),

            "comparison_reason": comparison.get("comparison_reason"),

            "compared_factors": comparison.get("compared_factors", []),

            "ranked_products": ranked_rows,

        },

        "external_discoveries": {

            "source": discovery.get("external_source"),

            "status": discovery.get("external_api_status"),

            "total_results": len(external_products),

            "products": external_products,

        },

        "alternatives": alternatives,

        "category": category,

        "compatibility": compatibility,

        "shoe_size_recommendation": shoe_size_result,

        "clothing_size_recommendation": clothing_size_result,

        "bundle": bundle,

        "review_insights": review_insights,

        "reasoning": reasoning,
        "decision_explanation": {
            "user_goal": user_request,
            "interpreted_query": search_parameters.get("query"),
            "budget_inr": search_parameters.get("max_price"),
            "selected_product": selected.get("name"),
            "selection_reasons": match_reasons,
            "compared_factors": comparison.get("compared_factors", []),
            "winner_score": score,
            "score_note": "Heuristic catalogue-match score; not a trained prediction.",
            "nearest_alternative": alternative_rows[0] if alternative_rows else None,
            "bundle_status": bundle.get("status") if isinstance(bundle, dict) else None,
        },

        "needs_user_input": follow_up is not None,

        "follow_up_question": follow_up,

        "agent_activity": activity,

        "search_parameters": search_parameters,

        "data_disclaimer": (

            "CompatBuy AI uses catalogue and demo data. Sample reviews and synthetic "

            "catalogue entries are not retailer-backed reviews or live inventory. "

            "Prices and availability may not reflect current retailer listings."

        ),

        "multi_agent": {

            "architecture": "orchestrator_with_specialist_agents",

            "agents_invoked": invoked_agents,

        },

    }




