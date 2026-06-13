import { describe, it, expect } from "vitest";
import { sanitizeInput, anonymizePersonalInfo, detectCrisis } from "./security";

describe("Sanitization Utilities (OWASP Guardrails)", () => {
  it("should handle empty or null values gracefully", () => {
    expect(sanitizeInput("")).toBe("");
  });

  it("should sanitize general HTML tags and avoid raw angle brackets", () => {
    const rawHTML = "<div>hello & welcome</div>";
    const result = sanitizeInput(rawHTML);
    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
    expect(result).toContain("&lt;div&gt;hello &amp; welcome&lt;&#x2F;div&gt;");
  });

  it("should securely neutralize common XSS vectors and script tags", () => {
    const malicious = '<script>alert("XSS")</script> <iframe src="evil.com"></iframe>';
    const result = sanitizeInput(malicious);
    expect(result).toBe(
      "&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt; &lt;iframe src=&quot;evil.com&quot;&gt;&lt;&#x2F;iframe&gt;"
    );
  });

  it("should escape quotes and forward slashes safely", () => {
    const sample = "John's slash / trial";
    const result = sanitizeInput(sample);
    expect(result).toBe("John&#x27;s slash &#x2F; trial");
  });
});

describe("Personal Data Anonymization Vector (PII Scrubbing)", () => {
  it("should return empty string for empty input", () => {
    expect(anonymizePersonalInfo("")).toBe("");
  });

  it("should identify and anonymize emails accurately", () => {
    const input = "Send updates to amit.singh123@gmail.com and CC mocktest_enquiry@coaching.ac.in";
    const anonymized = anonymizePersonalInfo(input);
    expect(anonymized).not.toContain("amit.singh123@gmail.com");
    expect(anonymized).not.toContain("mocktest_enquiry@coaching.ac.in");
    expect(anonymized).toContain("[ANON_EMAIL]");
    expect(anonymized).toBe("Send updates to [ANON_EMAIL] and CC [ANON_EMAIL]");
  });

  it("should mask various formulations of Indian phone numbers and keep privacy safe", () => {
    const phones = [
      "My cell is 9876543210.",
      "Call me on +91 8123456789.",
      "Contact support at +91-7654321098 please."
    ];
    for (const phoneText of phones) {
      const anonymized = anonymizePersonalInfo(phoneText);
      expect(anonymized).not.toMatch(/\d{10}/);
      expect(anonymized).toContain("[ANON_PHONE]");
    }
  });

  it("should identify and mask capitalized alphanumeric registration or roll numbers (8-12 chars)", () => {
    const rolls = [
      "My roll is JEE20261234.",
      "UPSC99887766 has been qualified.",
      "Registration Code: CAT7766554."
    ];
    for (const rollText of rolls) {
      const anonymized = anonymizePersonalInfo(rollText);
      expect(anonymized).toContain("[ANON_IDENTIFIER]");
    }
  });

  it("should leave standard words and non-PII integers of differing lengths untouched", () => {
    const text = "I scored 98 marks out of 100 on mock test number 5.";
    const anonymized = anonymizePersonalInfo(text);
    expect(anonymized).toBe(text);
  });
});

describe("Crisis Detection & Local short-circuit protocols", () => {
  it("should handle empty values safely with false response", () => {
    expect(detectCrisis("")).toBe(false);
  });

  it("should return false for highly stressed but non-harmful academic logs", () => {
    const text = "Very stressed with NEET mock exam results. Physics syllabus completed nahi ho raha, marks low hain.";
    expect(detectCrisis(text)).toBe(false);
  });

  it("should flag explicit distress keywords instantaneously for medical/social bypass", () => {
    const distressWords = [
      "I want to commit suicide",
      "I feel like ending my life right now.",
      "Think I will kill myself",
      "I am better off dead.",
      "atmasamarpan path choosing",
      "Main jaan de dunga agar drop test fail hua",
      "bahut tension hai main marna chahta"
    ];
    for (const entry of distressWords) {
      expect(detectCrisis(entry)).toBe(true);
    }
  });
});
