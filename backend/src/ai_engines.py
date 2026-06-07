import os
import re
import datetime
import random
import requests
import difflib
import nltk
import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import pipeline
from src.config import GROQ_API_KEY, GROQ_MODEL, GROQ_URL

# Module-level singleton — loaded once, reused across requests
_models = None
_groq_exhausted = False

def _load_models():
    global _models
    if _models is not None:
        return _models
    nltk.download("vader_lexicon", quiet=True)
    nltk.download("punkt",         quiet=True)
    nltk.download("punkt_tab",     quiet=True)
    sia        = SentimentIntensityAnalyzer()
    summarizer = pipeline("summarization", model="t5-small")
    try:
        df = pd.read_csv("chatbot_data.csv")
    except Exception:
        df = pd.DataFrame({
            "question": ["what is python", "what is ml", "what is dsa", "what is a list"],
            "answer": [
                "Python is a high-level interpreted programming language known for its simple readable syntax.",
                "Machine Learning is a field of AI that enables systems to learn from data automatically.",
                "DSA stands for Data Structures and Algorithms — the foundation of efficient programming.",
                "A list is an ordered mutable collection. Example: my_list = [1, 2, 3]",
            ],
        })
    vectorizer   = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(df["question"].values.astype("U"))
    _models = (sia, summarizer, df, vectorizer, tfidf_matrix)
    return _models

def get_sia():
    sia, *_ = _load_models()
    return sia

def _groq_available() -> bool:
    global _groq_exhausted
    return bool(GROQ_API_KEY) and not _groq_exhausted

def call_groq(messages: list, max_tokens: int = 1024) -> tuple[str, bool]:
    global _groq_exhausted
    if not GROQ_API_KEY:
        return "", False
    try:
        resp = requests.post(
            GROQ_URL,
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={"model": GROQ_MODEL, "messages": messages, "max_tokens": max_tokens, "temperature": 0.7},
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"].strip(), True
    except requests.exceptions.HTTPError:
        code = resp.status_code
        if code in (401, 429):
            _groq_exhausted = True
        return "", False
    except Exception:
        return "", False

def _correct_spelling(text: str, df) -> tuple[str, dict]:
    vocab   = list(set(" ".join(df["question"].values).lower().split()))
    words   = text.lower().split()
    out, fixes = [], {}
    for w in words:
        if len(w) <= 2:
            out.append(w); continue
        m = difflib.get_close_matches(w, vocab, n=1, cutoff=0.75)
        if m and m[0] != w:
            fixes[w] = m[0]; out.append(m[0])
        else:
            out.append(w)
    return " ".join(out), fixes

def _t5_chat_response(user_query: str, df, vectorizer, tfidf_matrix) -> str:
    corrected, corrections = _correct_spelling(user_query, df)
    uv  = vectorizer.transform([corrected])
    sim = cosine_similarity(uv, tfidf_matrix)
    idx = sim.argmax()
    note = ""
    if corrections:
        note = "📝 *Spell check: " + ", ".join(f"'{k}' → '{v}'" for k, v in corrections.items()) + "*\n\n"
    if sim[0][idx] < 0.2:
        return note + "I'm not sure about that. Try asking about Python, ML, DSA, or algorithms."
    return note + df.iloc[idx]["answer"]

def _clean_t5(text: str) -> str:
    text = re.sub(r'\s+([.,!?;:])', r'\1', text).strip()
    sentences, out = nltk.sent_tokenize(text), []
    for s in sentences:
        s = s.strip()
        if not s or len(s.split()) < 4: continue
        if s.startswith(("'", '"', '.', ',', '&')): continue
        if s.count('.') > 4 or re.search(r'\b(\w+)\s+\1\b', s): continue
        out.append(s[0].upper() + s[1:])
    return " ".join(out)

def _t5_summarize(text: str, target_words: int, summarizer) -> str:
    if len(text.split()) <= target_words:
        return text.strip()
    words  = text.split()
    chunks = [" ".join(words[i:i+400]) for i in range(0, len(words), 400)]
    chunks = [c for c in chunks if len(c.split()) >= 20]
    if not chunks: return text.strip()
    per   = max(50, target_words // len(chunks))
    parts = []
    for chunk in chunks:
        try:
            raw = summarizer(chunk, max_length=min(int(per*1.4), 512),
                             min_length=max(30, per), do_sample=False)
            parts.append(raw[0]["summary_text"])
        except Exception:
            parts.append(" ".join(chunk.split()[:per]))
    combined = _clean_t5(" ".join(parts))
    result, wc = [], 0
    for sent in nltk.sent_tokenize(combined):
        sw = len(sent.split())
        if wc + sw <= target_words + 25:
            result.append(sent); wc += sw
        else:
            break
    final = " ".join(result) if result else combined
    fw = final.split()
    if len(fw) > target_words + 35:
        final = " ".join(fw[:target_words+15])
        dot = final.rfind('.')
        if dot > len(final) * 0.5: final = final[:dot+1]
    return final.strip() or combined

def _apply_t5_format(raw: str, fmt: str, username: str) -> str:
    today = datetime.date.today().strftime("%B %d, %Y")
    sents = nltk.sent_tokenize(raw)
    wc    = len(raw.split())
    out   = f"### Summary ({fmt}) — ~{wc} words\n\n"
    if fmt == "Bullet Points":
        out += "#### Core Takeaways\n"
        for s in sents:
            s = s.strip()
            if s: out += f"- {s[0].upper()+s[1:]}\n"
    elif fmt == "Essay":
        intro = " ".join(sents[:2]) if len(sents) >= 2 else raw
        body  = " ".join(sents[2:-2]) if len(sents) > 4 else ""
        concl = " ".join(sents[-2:]) if len(sents) >= 2 else sents[-1]
        out  += f"**Introduction:** {intro[0].upper()+intro[1:]}\n\n"
        if body: out += f"**Core Discussion:** {body[0].upper()+body[1:]}\n\n"
        out  += f"**Conclusion:** {concl[0].upper()+concl[1:]}"
    elif fmt == "Letter":
        out += f"**Date:** {today}  \n**To:** Study Group Peers  \n\nDear Student,\n\n{raw}\n\nBest regards,  \n*{username}*"
    elif fmt == "Email":
        out += f"**Subject:** Lecture Summary — {today}  \n---  \nHi Team,\n\n{raw}\n\nThanks,  \n**{username}**"
    else:
        out += raw[0].upper() + raw[1:]
    return out

def get_chat_response(user_query: str, chat_history: list) -> tuple[str, dict]:
    sia, _, df, vectorizer, tfidf_matrix = _load_models()
    sentiment = sia.polarity_scores(user_query)
    if _groq_available():
        messages = [
            {"role": "system", "content": (
                "You are StudyPilot's AI tutor for students studying Python, Machine Learning, "
                "Data Science, DSA, and related CS topics. "
                "IMPORTANT FORMATTING RULES — always follow these:\n"
                "- Use **bold** for key terms and important concepts\n"
                "- Use bullet points (- item) or numbered lists (1. item) when listing multiple things\n"
                "- Use `inline code` for variable names, functions, and short snippets\n"
                "- Use ```python\n...\n``` code blocks for multi-line code examples\n"
                "- Use ### headings for major sections when the answer is long\n"
                "- Add 💡 tip callouts with > 💡 **Tip:** text for key insights\n"
                "- Separate sections with blank lines for readability\n\n"
                "RESPONSE LENGTH:\n"
                "- Simple factual questions: 2-4 sentences with key term bolded\n"
                "- Moderate questions: structured response with bullets or short code\n"
                "- Complex questions: full explanation with headings, bullets, code blocks\n"
                "Never pad. Never over-explain simple questions. Always format cleanly."
            )},
        ]
        for msg in chat_history[-10:]:
            messages.append({"role": "user" if msg["role"] == "user" else "assistant", "content": msg["text"]})
        messages.append({"role": "user", "content": user_query})
        answer, ok = call_groq(messages, max_tokens=1500)
        if ok:
            return answer, sentiment
    answer = _t5_chat_response(user_query, df, vectorizer, tfidf_matrix)
    return answer, sentiment

def get_summary(text: str, target_words: int, fmt: str, username: str) -> tuple[str, str]:
    if _groq_available():
        today = datetime.date.today().strftime("%B %d, %Y")
        fmt_map = {
            "Plain Text":   "Write a clear, flowing paragraph summary with no headers.",
            "Bullet Points":"Format as a markdown bullet list with a '#### Core Takeaways' heading.",
            "Essay":        "Structure as an essay with **Introduction:**, **Core Discussion:**, and **Conclusion:** sections.",
            "Letter":       f"Format as a letter starting with 'Date: {today}', 'To: Study Group Peers', 'Dear Student,'",
            "Email":        f"Format as an email starting with 'Subject: Lecture Summary — {today}', 'Hi Team,'",
        }
        prompt = (
            f"You are an expert academic summariser. Write a summary of EXACTLY approximately {target_words} words.\n\n"
            f"FORMAT INSTRUCTION: {fmt_map.get(fmt, fmt_map['Plain Text'])}\n\n"
            f"STRICT WORD COUNT: Target {target_words} words (±15 words acceptable).\n\n"
            f"TEXT TO SUMMARISE:\n\"\"\"\n{text}\n\"\"\"\n\nWrite the {target_words}-word summary now:"
        )
        raw, ok = call_groq(
            [{"role": "user", "content": prompt}],
            max_tokens=max(int(target_words * 3), 512)
        )
        if ok:
            wc = len(raw.split())
            return f"### Summary ({fmt}) — ~{wc} words\n\n{raw}", "groq"
    _, summarizer, *_ = _load_models()
    raw = _t5_summarize(text, target_words, summarizer)
    return _apply_t5_format(raw, fmt, username), "t5"
