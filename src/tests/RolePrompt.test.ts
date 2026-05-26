import { describe, it, expect } from 'vitest';
import { ROLE_PROMPT } from '../prompts/rolePrompt.js';

describe('Role Prompt', () => {
  it('should define the role as Career Advisor', () => {
    expect(ROLE_PROMPT).toContain('Career Advisor');
  });

  it('should mention key responsibilities', () => {
    const responsibilities = [
      'recommend',
      'explanation',
      'bias',
      'discrimination',
      'professional',
    ];

    responsibilities.forEach((responsibility) => {
      expect(ROLE_PROMPT.toLowerCase()).toContain(responsibility.toLowerCase());
    });
  });

  it('should emphasize avoiding bias and discrimination', () => {
    expect(ROLE_PROMPT.toLowerCase()).toContain('bias');
    expect(ROLE_PROMPT.toLowerCase()).toContain('discrimination');
  });

  it('should mention professional language requirement', () => {
    expect(ROLE_PROMPT.toLowerCase()).toContain('professional');
  });

  it('should be substantial in length', () => {
    // Role prompt should be detailed, at least 200 characters
    expect(ROLE_PROMPT.length).toBeGreaterThan(200);
  });

  it('should specify number of recommendations', () => {
    expect(ROLE_PROMPT).toContain('3');
  });

  it('should mention suitability scoring', () => {
    expect(ROLE_PROMPT.toLowerCase()).toContain('suitability');
    expect(ROLE_PROMPT).toContain('0-100');
  });

  it('should mention skill gap analysis', () => {
    expect(ROLE_PROMPT.toLowerCase()).toContain('skill');
    expect(ROLE_PROMPT.toLowerCase()).toContain('gap');
  });

  it('should emphasize objectivity', () => {
    const objectivityTerms = ['objective', 'criteria', 'based on'];
    const hasObjectivityReference = objectivityTerms.some((term) =>
      ROLE_PROMPT.toLowerCase().includes(term)
    );

    expect(hasObjectivityReference).toBe(true);
  });

  it('should mention career growth or progression', () => {
    const growthTerms = ['growth', 'progression', 'development', 'career'];
    const hasGrowthReference = growthTerms.some((term) =>
      ROLE_PROMPT.toLowerCase().includes(term)
    );

    expect(hasGrowthReference).toBe(true);
  });
});
