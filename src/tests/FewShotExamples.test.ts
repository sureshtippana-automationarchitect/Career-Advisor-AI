import { describe, it, expect } from 'vitest';
import { FEW_SHOT_EXAMPLES, formatFewShotExamples } from '../prompts/fewShotExamples.js';

describe('Few-Shot Examples', () => {
  it('should have exactly 5 examples', () => {
    expect(FEW_SHOT_EXAMPLES).toHaveLength(5);
  });

  it('should have complete profile data for each example', () => {
    FEW_SHOT_EXAMPLES.forEach((example, index) => {
      expect(example.profile, `Example ${index + 1} should have a profile`).toBeDefined();
      expect(example.profile.education, `Example ${index + 1} should have education`).toBeTruthy();
      expect(example.profile.experience, `Example ${index + 1} should have experience`).toBeTruthy();
      expect(example.profile.skills.length, `Example ${index + 1} should have skills`).toBeGreaterThan(0);
      expect(example.profile.careerGoal, `Example ${index + 1} should have career goal`).toBeTruthy();
    });
  });

  it('should have 3 recommendations for each example', () => {
    FEW_SHOT_EXAMPLES.forEach((example, index) => {
      expect(
        example.expectedRecommendations,
        `Example ${index + 1} should have recommendations`
      ).toHaveLength(3);
    });
  });

  it('should format examples correctly', () => {
    const formatted = formatFewShotExamples();

    expect(formatted).toBeTruthy();
    expect(formatted).toContain('Example 1:');
    expect(formatted).toContain('Example 5:');
    expect(formatted).toContain('Education:');
    expect(formatted).toContain('Experience:');
    expect(formatted).toContain('Skills:');
    expect(formatted).toContain('Career Goal:');
    expect(formatted).toContain('Recommended Roles:');
  });

  it('should have diverse career examples', () => {
    const careers = FEW_SHOT_EXAMPLES.map((ex) => ex.profile.education.toLowerCase());

    // Check for variety in education backgrounds
    const uniqueEducation = new Set(careers);
    expect(uniqueEducation.size).toBeGreaterThanOrEqual(4);
  });

  it('should have realistic skill sets', () => {
    FEW_SHOT_EXAMPLES.forEach((example, index) => {
      const skillCount = example.profile.skills.length;
      expect(
        skillCount,
        `Example ${index + 1} should have between 3 and 10 skills`
      ).toBeGreaterThanOrEqual(3);
      expect(
        skillCount,
        `Example ${index + 1} should have between 3 and 10 skills`
      ).toBeLessThanOrEqual(10);
    });
  });
});

describe('formatFewShotExamples', () => {
  it('should include all required fields in formatted output', () => {
    const formatted = formatFewShotExamples();

    // Check that all examples are included
    for (let i = 1; i <= 5; i++) {
      expect(formatted).toContain(`Example ${i}:`);
    }

    // Check that all field labels are present
    expect(formatted).toContain('Education:');
    expect(formatted).toContain('Experience:');
    expect(formatted).toContain('Skills:');
    expect(formatted).toContain('Career Goal:');
    expect(formatted).toContain('Recommended Roles:');
  });

  it('should use separator between examples', () => {
    const formatted = formatFewShotExamples();
    const separatorCount = (formatted.match(/---/g) || []).length;

    // Should have 4 separators for 5 examples
    expect(separatorCount).toBe(4);
  });
});
