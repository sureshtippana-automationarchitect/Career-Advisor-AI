import { SafetyCheckResult } from '../models/interfaces.js';

/**
 * Safety Validator Service
 * Detects bias, discrimination, and offensive content in AI-generated responses
 */
export class SafetyValidatorService {
  // Arrays of Regular Expression (regex) patterns for detecting problematic content
  private biasPatterns: RegExp[];        // Patterns for detecting bias
  private offensivePatterns: RegExp[];   // Patterns for detecting offensive language

  /**
   * Constructor - runs when creating: new SafetyValidatorService()
   * Initializes all the regex patterns used for content validation
   */
  constructor() {
    // Initialize bias detection patterns
    // RegExp (Regular Expressions) are patterns for matching text
    // Example: /\bcat\b/i matches "cat" as a whole word (case-insensitive)
    // \b = word boundary, \s+ = one or more spaces, i = case-insensitive flag
    this.biasPatterns = [
      // Gender bias
      // Detects phrases like "men are better" or "women are inferior"
      /\b(men|women|male|female|boy|girl)s?\s+(are\s+)?(better|worse|superior|inferior)\b/i,
      // Detects "only suitable for men/women" or "best suited for males/females"
      /\b(only|best)\s+(\w+\s+)?(suited|suitable)\s+for\s+(men|women|males|females)\b/i,
      // Detects "not appropriate for women/men"
      /\bnot\s+(appropriate|suitable)\s+for\s+(women|men)\b/i,
      
      // Age bias
      // Detects phrases like "too old for" or "too young to"
      /\btoo\s+(old|young)\s+(for|to)\b/i,
      // Detects generalizations like "older people can't" or "younger workers are"
      /\b(older|younger)\s+(people|workers|employees)\s+(are|can't|cannot)\b/i,
      // Detects "age limit" or "age restriction"
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
   * This method loops through all regex patterns and tests the content
   * against each pattern to detect bias
   */
  private checkBiasPatterns(content: string): string[] {
    // Initialize an empty array to store any issues found
    const issues: string[] = [];

    // Loop through each regex pattern in the biasPatterns array
    // 'for...of' loops through each item in the array
    for (const pattern of this.biasPatterns) {
      // .test() is a regex method that returns true if the pattern matches the content
      if (pattern.test(content)) {
        // .push() adds the detected issue to the issues array
        issues.push(`Potential bias detected: pattern "${pattern.source}"`);
      }
    }

    // Return all the issues found (empty array if no issues)
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
   * This is useful when you need to check several pieces of text in one go
   * For example, checking all job recommendations at once
   */
  validateMultipleFields(fields: string[]): SafetyCheckResult {
    // Array to collect all issues from all fields
    const allIssues: string[] = [];
    
    // Loop through each field using a traditional for loop
    // i is the index (0, 1, 2, ...) and fields[i] is the actual text
    for (let i = 0; i < fields.length; i++) {
      // Check this specific field for safety issues
      const result = this.validateContent(fields[i]);
      
      // If this field has issues, add them to our collection
      if (!result.isSafe) {
        // .join(', ') combines all issues into one string separated by commas
        allIssues.push(`Field ${i + 1}: ${result.issues.join(', ')}`);
      }
    }

    // Return the final safety check result
    return {
      // isSafe is true only if no issues were found (array is empty)
      isSafe: allIssues.length === 0,
      issues: allIssues,
      // Ternary operator (? :) - if condition ? value_if_true : value_if_false
      message:
        allIssues.length === 0
          ? 'All fields passed safety validation'
          : 'Some fields contain potentially biased or offensive language',
    };
  }
}
