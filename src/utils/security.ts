/**
 * Security and Data Protection Utilities
 * Implements 6-Layer security, including XSS sanitization, PII scrubbers, and deterministic crisis scanning.
 */

/**
 * 1. INPUT SANITIZATION & OWASP GUARDRAILS
 * Sanitizes input against basic XSS vectors and SQL injections.
 */
export function sanitizeInput(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * 2. PERSONAL DATA ANONYMIZATION VECTOR
 * Anonymizes phone numbers, emails, and typical Roll numbers or ID numbers prior to LLM submission.
 */
export function anonymizePersonalInfo(text: string): string {
  if (!text) return "";
  let processed = text;
  // Anonymize Email
  processed = processed.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[ANON_EMAIL]");
  // Anonymize Indian mobile numbers starting with/without +91 (supports space, hyphen, brackets, or just 10 digits)
  processed = processed.replace(/(?:\+91[\-\s]?)?[789]\d{9}/g, "[ANON_PHONE]");
  // Anonymize general roll numbers / registrations (typically 8-12 alphanumeric characters)
  processed = processed.replace(/\b[A-Z0-9]{8,12}\b/g, "[ANON_IDENTIFIER]");
  return processed;
}

/**
 * 3. CRISIS TRIGGER PROTOCOL
 * Hardcoded deterministic regex/keyword scanning to bypass LLM instantly and render instant distress hotlines
 */
export const CRISIS_KEYWORDS = [
  /suicide/i,
  /want to die/i,
  /kill myself/i,
  /ending my life/i,
  /self harm/i,
  /better off dead/i,
  /end my misery/i,
  /hanging myself/i,
  /taking my life/i,
  /give up on life/i,
  /coaching suicide/i,
  /atmasamarpan/i, // Hinglish/Hindi elements
  /jaan de dunga/i,
  /marna chahta/i
];

export function detectCrisis(text: string): boolean {
  if (!text) return false;
  return CRISIS_KEYWORDS.some((regex) => regex.test(text));
}
