# PART D: GDPR COMPLIANCE & PRIVACY (PDF Handling)

## D.1 PDF Data Privacy Model

The core of StudyPilot V3 is the **AI Past Exam Analyzer**. This requires users to upload potentially sensitive university documents (past exam papers, syllabi, lecture slides).

### D.1.1 Zero-Retention Document Processing
To comply with GDPR and university academic integrity policies, we enforce strict data handling for uploaded files:
1. **No Permanent Storage:** Uploaded PDFs are parsed entirely in memory using Next.js Serverless Functions (or stored ephemerally in `/tmp`).
2. **Immediate Destruction:** Once the text is extracted and sent to the Groq API for 80/20 analysis, the original PDF and the raw extracted text are permanently deleted from the server.
3. **Database Storage:** The database only stores the *derived metadata* (e.g., Topic: "Thermodynamics", Frequency: 12), never the actual exam questions or university IP.

### D.1.2 LLM Privacy Agreement
Groq API is utilized as our processing sub-processor. We must explicitly opt out of data training in our API contracts. User uploaded study materials are **never** used to train models.

---

## D.2 Data Portability & The Forgetting Curve
When a user requests a GDPR data export, they receive a JSON payload containing:
- Their exact Spaced Repetition schedule.
- Their active recall success rates per topic.
- Their sleep correlation data.
This ensures complete portability of their academic profile.
