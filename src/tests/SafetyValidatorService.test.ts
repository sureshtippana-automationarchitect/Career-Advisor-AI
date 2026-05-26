import { describe, it, expect, beforeEach } from 'vitest';
import { SafetyValidatorService } from '../services/SafetyValidatorService.js';

describe('SafetyValidatorService', () => {
  let validator: SafetyValidatorService;

  beforeEach(() => {
    validator = new SafetyValidatorService();
  });

  describe('validateContent', () => {
    it('should pass validation for safe content', () => {
      const safeContent =
        'You would be a great fit for this role based on your technical skills and experience. Consider learning cloud technologies to enhance your profile.';

      const result = validator.validateContent(safeContent);

      expect(result.isSafe).toBe(true);
      expect(result.issues).toHaveLength(0);
      expect(result.message).toBe('Content passed safety validation');
    });

    it('should detect gender bias', () => {
      const biasedContent =
        'This role is only suitable for men because it requires physical strength.';

      const result = validator.validateContent(biasedContent);

      expect(result.isSafe).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should detect age bias', () => {
      const biasedContent =
        'You are too old for this position. Younger workers are better suited.';

      const result = validator.validateContent(biasedContent);

      expect(result.isSafe).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should detect offensive language', () => {
      const offensiveContent =
        'Your skills are useless. You should just give up on this career path.';

      const result = validator.validateContent(offensiveContent);

      expect(result.isSafe).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should detect problematic absolute statements', () => {
      const problematicContent =
        'Everyone with this background will never succeed in tech.';

      const result = validator.validateContent(problematicContent);

      expect(result.isSafe).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });

  describe('validateMultipleFields', () => {
    it('should pass validation when all fields are safe', () => {
      const fields = [
        'Software Engineer - great fit based on your skills',
        'Data Analyst - matches your analytical background',
        'Product Manager - aligns with your experience',
      ];

      const result = validator.validateMultipleFields(fields);

      expect(result.isSafe).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should fail validation when any field contains bias', () => {
      const fields = [
        'Software Engineer - great fit based on your skills',
        'This role is not appropriate for women',
        'Product Manager - aligns with your experience',
      ];

      const result = validator.validateMultipleFields(fields);

      expect(result.isSafe).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should detect multiple issues across different fields', () => {
      const fields = [
        'You are too young for this senior role',
        'Men are better at technical positions',
        'Your skills are worthless in this industry',
      ];

      const result = validator.validateMultipleFields(fields);

      expect(result.isSafe).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });
});
