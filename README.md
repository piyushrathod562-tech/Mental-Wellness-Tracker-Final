# Samarthan: Mental Wellness Tracker for High-Stakes Indian Competitive Exams

This repository contains the complete production-grade architectural blueprint and implementation plan for **Samarthan**, a secure, full-stack mental wellness tracking companion tailored for Indian competitive exam aspirants (JEE, NEET, UPSC, Corporate & Technical tests). 

The platform implements a server-client architecture using **TypeScript + Node/Express Ingress + Google AI Studio Gemini API**, enforcing bulletproof security, multi-lingual adaptability (Hinglish, Hindi, Bengali, etc.), and local deterministic safety overrides.

---

## 🏛️ Comprehensive 6-Layer Architecture Blueprint

### 1. Problem Statement Alignment & Core Logic
Indian competitive preparation (coaching environments like Kota, Mukherjee Nagar, Karol Bagh) subjects candidates to extraordinary cognitive load, acute fear of failure, and chronic sleep deprivation.
* **Orchestration Layer:** Mediates client interactions strictly via the Node/Express backend (`server.ts`). Direct-to-browser Gemini keys are forbidden.
* **Ingestion Pipeline:** Captures both structured metadata (exam context, current mood ratings) and unstructured freeform journal logs containing Hinglish code-switching or regional context.
* **Prompt Engineering Strategy:** Uses a secure system instruction establishing a warm, non-clinical "elder sibling / mentor" persona who avoids medical diagnostics while encouraging student resilience.

#### Ingestion Schema Specifications
| Field Name | Ingestion Type | Requirement & Safeguard | Strategic Value |
| :--- | :--- | :--- | :--- |
| **`rawText`** | String (unstructured) | HTML-escaped & sanitized; matched against standard Distress Regex | Safe support for freeform Hinglish/Hindi or regional text |
| **`examType`** | Enum (JEE, NEET, UPSC, etc.)| Validated on server-side; defaults to `OTHER` | Adapts the model's understanding of specific coaching cultures |
| **`moodRating`** | Integer (1 to 5) | Verified inside `[1, 5]` bounds | Keeps quantitative metrics without storing raw student data |
| **`preferredLanguage`** | Enum (HINGLISH, Hindi, Bengali, etc.) | Maps companion tone and tips translation | Maximizes demographic accessibility and comfort |

---

### 2. Code Quality & Architectural Integrity
The system employs strict TypeScript interface typing and structured JSON responses via Gemini's `responseSchema` configuration. This eliminates typical string-split parsing failures and guards downstream React code.

```typescript
// Explicit static types for safe downstream consumption
export interface JournalAnalysis {
  triggers: string[];
  patterns: string[];
  copingStrategies: string[];
  mindfulnessExercises: string[];
  toneExplanation: string;
}

export interface JournalEntry {
  id: string;
  timestamp: string;
  text: string;
  examType: 'JEE' | 'NEET' | 'UPSC' | 'GATE' | 'CA' | 'OTHER';
  moodRating: number;
  analysis?: JournalAnalysis;
  isCrisis?: boolean;
}
```

---

### 3. Comprehensive Security, Privacy & Guardrails
* **OWASP Input Validation:** Escapes and sanitizes input text (`sanitizeInput`) checking for persistent XSS blocks before storage in our database.
* **Data Privacy (PII Scrubbing):** Automatically identifies Indian Mobile Numbers (`+91`), emails, and typical Roll/Registration Numbers and scrambles them into `[ANON_PHONE]`, `[ANON_EMAIL]`, and `[ANON_IDENTIFIER]` before transmitting the payload to outer model APIs.
* **Safety Thresholds:** Google AI Studio safety levels for harassment, dangerous content, sexually explicit, and hate speech are locked to `BLOCK_MEDIUM_AND_ABOVE`.
* **Deterministic Crisis Override:** If self-harm keywords or severe distress symbols are scanned, the system immediately short-circuits the LLM call entirely, instantly displaying local and national Indian crisis hotlines (Vandrevala Foundation, AASRA, Kiran) under **1ms latency**.

---

### 4. System Efficiency & Cost Optimization
* **Sliding Window Context:** Instead of sending massive cumulative log structures, the Express server injects recent summaries dynamically representing the history context.
  * *Formula:* $T_{total} = T_{system} + T_{previous\_2\_summaries} + T_{current\_log\_text}$
  * This keeps token count minimal while maintaining chronological, stateful continuity.
* **High-Throughput Rendering:** In-memory tracking and optimized payload deliveries minimize unnecessary network overhead, allowing successful operations under slow 3G mobile networks.

---

### 5. Accessibility (a11y) & Inclusivity
* **WCAG 2.1 AA Compliance:** Standard compliance guarantees deep color contrasts (using a Slate dark high-contrast mode), keyboard focus indicators for stressed touchpads, and full ARIA navigation guides.
* **Multilingual Demographic Reach:** Full selection controls let students choose Hinglish, Hindi, Bengali, Tamil, or Telugu. The Gemini client renders advice inside the user's preferred native language to assure deep emotional reliability.

---

### 6. Testing & Validation Framework
To evaluate the companion's performance continuously:
1. **Unit Tests:** Deterministic tests validating PII mask logic and Distress keyword pattern-matching under 1ms.
2. **Integration Tests:** Verifying graceful offline fallback errors, automatic rate-limit overrides, and recovery protocols if connection with Google AI Studio gets lost.
3. **Continuous Assertion Validation:** Checking that the response conforms to the diagnostic ban guidelines, ensuring zero medical statements are offered.

---

## 🛠️ Step-by-Step Execution Guide & Commands

### 1. Prerequisites & Dev Mode Setup
Install the dependencies specified in `package.json`:
```bash
npm install
```

Start the application with our tsx-supported Express Server:
```bash
npm run dev
```
The server will bind on the hardcoded port `3050` (internally mapped on `3000` via our Cloud-Ingress Proxy).

### 2. Live Building for Cold-Starts
Compiles both clean Vite client assets and bundles server.ts safely into a self-contained CommonJS target (`dist/server.cjs`) using `esbuild`:
```bash
npm run build
```

Launch the production compiled server target:
```bash
npm run start
```
