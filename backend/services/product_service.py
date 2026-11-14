
from backend.products import products


def get_all_products():
    return products


def search_products(query, max_price=None, category=None):

    query_words = query.lower().strip().split()
    results = []

    for product in products:

        # Include product specifications in searchable text
        searchable_text = " ".join([
            product.get("name", ""),
            product.get("brand", ""),
            product.get("category", ""),
            product.get("description", ""),
            str(product.get("specifications", ""))
        ]).lower()

        # Every search word must be present
        if query_words and not all(
            word in searchable_text for word in query_words
        ):
            continue

        # Budget filter
        if max_price is not None:
            if product["price"] > max_price:
                continue

        # Category filter
        if category:
            if product["category"].lower() != category.lower():
                continue

        results.append(product)

    return results
