FROM python:3.10-slim

RUN apt-get update && apt-get install -y build-essential curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# PYTHONPATH set to /app so `from src.xxx import` works
ENV PYTHONPATH=/app

COPY requirements.txt .

RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir -r requirements.txt

# Pre-cache NLTK data and Transformers T5 weights
RUN python -c "import nltk; nltk.download('vader_lexicon'); nltk.download('punkt'); nltk.download('punkt_tab')"
RUN python -c "from transformers import pipeline; pipeline('summarization', model='t5-small')"

COPY . .

EXPOSE 8000

CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
