# MUSE AI — Intelligent Multi-Agent Shopping Assistant

MUSE AI is an intelligent shopping assistant designed to simplify online product discovery through AI-powered recommendations, product comparisons, compatibility analysis, smart bundles, and customer review insights.

## Features

- **Product Discovery:** Find products based on natural-language requests.
- **Budget-Based Recommendations:** Discover products within a specified budget.
- **Product Comparison:** Compare available products and their specifications.
- **Compatibility Analysis:** Check product compatibility with existing devices.
- **Smart Bundles:** Build combinations of products within a budget.
- **Review Intelligence:** Analyse available customer reviews and identify positive feedback and recurring complaints.

## Tech Stack

- Python
- Flask
- React
- Vite
- JavaScript
- OpenRouter API
- Groq API
- Multi-agent architecture

## Project Structure

- `backend/` — Backend services, agents, catalogue and recommendation logic.
- `src/` — React frontend source code.
- `index.html` — Frontend entry point.
- `package.json` — Frontend dependencies and scripts.
- `requirements.txt` — Python dependencies.

## Running Locally

### Backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m backend.app
```

### Frontend

```bash
npm install
npm run dev
```

## Data Disclaimer

This project uses a bundled mock catalogue and sample review data for demonstration. Product prices, availability and reviews should not be interpreted as verified live retailer information.

## Project

Developed as an AI-powered shopping assistant project for product discovery and intelligent purchasing support.
