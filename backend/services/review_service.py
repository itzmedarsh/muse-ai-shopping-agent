
from backend.data.reviews import reviews


def analyze_reviews(product_id):

    product_reviews = reviews.get(product_id, [])

    if not product_reviews:
        return {
            "status": "error",
            "message": "No reviews available."
        }

    positive_words = [
        "excellent", "great", "fast", "reliable",
        "perfectly", "easy", "good"
    ]

    negative_words = [
        "slow", "expensive", "poor", "bad",
        "warm", "problem", "issue", "difficult"
    ]

    positive = []
    negative = []

    for review in product_reviews:

        review_lower = review.lower()

        if any(word in review_lower for word in positive_words):
            positive.append(review)

        if any(word in review_lower for word in negative_words):
            negative.append(review)

    return {
        "status": "success",
        "total_reviews": len(product_reviews),
        "positive_reviews": positive,
        "negative_reviews": negative,
        "positive_count": len(positive),
        "negative_count": len(negative)
    }
