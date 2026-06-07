# PART D: GDPR COMPLIANCE & PII SANITIZATION PIPELINE

## D.1 Step-by-Step Document Sanitization Pipeline

When students upload past exams, homework papers, and private course slides, these documents regularly contain sensitive Personally Identifiable Information (PII) including student names, email addresses, professor contact details, and student ID numbers. 

Under GDPR and FERPA, sending this un-sanitized data to external third-party API providers like Groq violates strict compliance standards.

To mitigate this, StudyPilot executes a mandatory, multi-step pipeline for every document upload **before** sending text to external LLM endpoints:

1. **In-Memory Streaming:** Read the file as a binary stream directly into memory (Vercel Node.js Serverless runtime or FastAPI VM). **DO NOT** write the raw PDF file to persistent disk storage.
2. **Local NER Masking:** Execute a local Named Entity Recognition (NER) model (e.g., Presidio Analyzer) on the extracted text string. Locate and mask all occurrences of names, student IDs, email formats, and institution-specific identifiers. Replace detected PII with generic tags (e.g., `[NAME]`, `[ID]`).
3. **Dependency-Free Extraction:** Run the dependency-free `unpdf` engine to extract structured, plain-text characters from the masked stream. Convert the extracted content into a lightweight markdown file (under the 4.5MB payload limit).
4. **Abstract Extraction:** Prompt the LLM to extract only the abstract, structural syllabus headings, and practice question formatting. Discard the dense, copyright-protected body pages.
5. **Memory Flush:** Store the anonymous structural metadata and vector embeddings in Supabase (`pgvector`). Immediately flush the local server memory buffer, leaving zero footprint of the original PDF document.

## D.2 Copyright Infringement Protections

Uploading copyrighted academic articles or textbook chapters to generative AI tools constitutes unauthorized "republishing."

StudyPilot explicitly prohibits the upload of full-text copyrighted books or licensed journal articles. The platform restricts processing to open-access creative commons documents, student-authored notes, or requires users to provide public links (e.g., DOIs or library portal links) rather than direct file uploads.
