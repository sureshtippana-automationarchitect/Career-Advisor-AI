import { SafetyCheckResult } from '../models/interfaces.js';

/**
 * Safety Validator Service
 * Detects bias, discrimination, and offensive content in AI-generated responses
 */
export class SafetyValidatorService {
  private biasPatterns: RegExp[];
  private offensivePatterns: RegExp[];

  constructor() {
    // Initialize bias detection patterns
    this.biasPatterns = [
      // Gender bias
      /\b(men|women|male|female|boy|girl)s?\s+(are\s+)?(better|worse|superior|inferior)\b/i,
      /\b(only|best)\s+(\w+\s+)?(suited|suitable)\s+for\s+(men|women|males|females)\b/i,
      /\bnot\s+(appropriate|suitable)\s+for\s+(women|men)\b/i,
      
      // Age bias
      /\btoo\s+(old|young)\s+(for|to)\b/i,
      /\b(older|younger)\s+(people|workers|employees)\s+(are|can't|cannot)\b/i,
      /\bage\s+(limit|restriction|barrier)\b/i,
      
      // Race/ethnicity bias
      /\b(race|ethnicity|nationality|origin)\s+(makes?|determines?)\b/i,
      /\b(certain|some)\s+(races?|ethnicities|nationalities)\s+(are|tend to)\b/i,
      
      // Religion bias
      /\b(religion|religious\s+belief)s?\s+(prevents?|limits?|restricts?)\b/i,
      
      // Disability bias
      /\b(disabled|handicapped)\s+(people|persons?|individuals?)\s+(cannot|can't|unable)\b/i,
      
      // Stereotyping
      /\b(typical|naturally|inherently)\s+(good|bad)\s+at\b/i,
      /\bborn\s+to\s+(be|become)\b/i,
    ];

    // Initialize offensive language patterns
    this.offensivePatterns = [
      /\b(stupid|dumb|idiot|moron)\b/i,
      /\b(worthless|useless|pathetic)\b/i,
      /\b(hate|despise)\b/i,
      /\b(never\s+succeed|will\s+fail|destined\s+to\s+fail)\b/i,
      /\byou\s+(can't|cannot)\s+do\s+(it|this|that)\b/i,
      /\bgive\s+up\b/i,
      /\b(waste\s+of\s+time|waste\s+of\s+effort)\b/i,
    ];
  }

  /**
   * Validate AI-generated content for safety issues
   * Checks for bias, discrimination, and offensive language
   */
  validateContent(content: string): SafetyCheckResult {
    const issues: string[] = [];

    // Check for bias patterns
    const biasIssues = this.checkBiasPatterns(content);
    issues.push(...biasIssues);

    // Check for offensive language
    const offensiveIssues = this.checkOffensivePatterns(content);
    issues.push(...offensiveIssues);

    // Check for absolute statements that might be problematic
    const absoluteIssues = this.checkAbsoluteStatements(content);
    issues.push(...absoluteIssues);

    const isSafe = issues.length === 0;

    return {
      isSafe,
      issues,
      message: isSafe
        ? 'Content passed safety validation'
        : 'Content contains potentially biased or offensive language',
    };
  }

  /**
   * Check content against bias patterns
   */
  private checkBiasPatterns(content: string): string[] {
    const issues: string[] = [];

    for (const pattern of this.biasPatterns) {
      if (pattern.test(content)) {
        issues.push(`Potential bias detected: pattern "${pattern.source}"`);
      }
    }

    return issues;
  }

  /**
   * Check content against offensive language patterns
   */
  private checkOffensivePatterns(content: string): string[] {
    const issues: string[] = [];

    for (const pattern of this.offensivePatterns) {
      if (pattern.test(content)) {
        issues.push(
          `Potentially offensive language detected: pattern "${pattern.source}"`
        );
      }
    }

    return issues;
  }

  /**
   * Check for problematic absolute statements
   */
  private checkAbsoluteStatements(content: string): string[] {
    const issues: string[] = [];
    const absolutePatterns = [
      /\b(always|never|everyone|no one|all|none)\s+(can|cannot|can't|will|won't)\b/i,
      /\b(impossible|guaranteed|certain)\s+(to\s+)?(fail|succeed)\b/i,
    ];

    for (const pattern of absolutePatterns) {
      if (pattern.test(content)) {
        issues.push(
          `Potentially problematic absolute statement: pattern "${pattern.source}"`
        );
      }
    }

    return issues;
  }

  /**
   * Validate multiple text fields at once
   */
  validateMultipleFields(fields: string[]): SafetyCheckResult {
    const allIssues: string[] = [];
    
    for (let i = 0; i < fields.length; i++) {
      const result = this.validateContent(fields[i]);
      if (!result.isSafe) {
        allIssues.push(`Field ${i + 1}: ${result.issues.join(', ')}`);
      }
    }

    return {
      isSafe: allIssues.length === 0,
      issues: allIssues,
      message:
        allIssues.length === 0
          ? 'All fields passed safety validation'
          : 'Some fields contain potentially biased or offensive language',
    };
  }
}
