import { describe, it, expect } from 'vitest';
import { UserProfile } from '../models/interfaces.js';

describe('UserProfile Interface', () => {
  it('should accept a valid profile', () => {
    const validProfile: UserProfile = {
      education: 'Bachelor of Computer Science',
      experience: '3 years as Software Developer',
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
      careerGoal: 'Become a Senior Full Stack Developer',
    };

    expect(validProfile).toBeDefined();
    expect(validProfile.education).toBe('Bachelor of Computer Science');
    expect(validProfile.experience).toBe('3 years as Software Developer');
    expect(validProfile.skills).toHaveLength(4);
    expect(validProfile.careerGoal).toBe('Become a Senior Full Stack Developer');
  });

  it('should handle profile with minimal skills', () => {
    const minimalProfile: UserProfile = {
      education: 'High School Diploma',
      experience: 'Entry level',
      skills: ['Communication'],
      careerGoal: 'Start a career in tech',
    };

    expect(minimalProfile).toBeDefined();
    expect(minimalProfile.skills).toHaveLength(1);
  });

  it('should handle profile with extensive skills', () => {
    const extensiveProfile: UserProfile = {
      education: 'Master of Computer Science',
      experience: '10 years in software development',
      skills: [
        'JavaScript',
        'TypeScript',
        'Python',
        'Java',
        'React',
        'Angular',
        'Vue',
        'Node.js',
        'Express',
        'MongoDB',
        'PostgreSQL',
        'AWS',
        'Docker',
        'Kubernetes',
        'CI/CD',
      ],
      careerGoal: 'Become a Technical Architect',
    };

    expect(extensiveProfile).toBeDefined();
    expect(extensiveProfile.skills.length).toBeGreaterThan(10);
  });

  it('should handle empty skills array', () => {
    const emptySkillsProfile: UserProfile = {
      education: 'Bachelor of Arts',
      experience: 'Recent graduate',
      skills: [],
      careerGoal: 'Find my first job',
    };

    expect(emptySkillsProfile).toBeDefined();
    expect(emptySkillsProfile.skills).toHaveLength(0);
  });

  it('should handle profile with special characters', () => {
    const specialCharsProfile: UserProfile = {
      education: 'B.Sc. in Computer Science & Engineering',
      experience: '2.5 years @ Tech Corp.',
      skills: ['C++', 'C#', '.NET', 'SQL'],
      careerGoal: 'Lead developer @ FAANG company',
    };

    expect(specialCharsProfile).toBeDefined();
    expect(specialCharsProfile.skills).toContain('C++');
    expect(specialCharsProfile.skills).toContain('C#');
  });
});

describe('Profile Validation Logic', () => {
  it('should identify invalid profile - empty education', () => {
    const invalidProfile: UserProfile = {
      education: '',
      experience: '3 years',
      skills: ['JavaScript'],
      careerGoal: 'Become a developer',
    };

    const isValid = invalidProfile.education.length > 0;
    expect(isValid).toBe(false);
  });

  it('should identify invalid profile - empty experience', () => {
    const invalidProfile: UserProfile = {
      education: 'Bachelor',
      experience: '',
      skills: ['JavaScript'],
      careerGoal: 'Become a developer',
    };

    const isValid = invalidProfile.experience.length > 0;
    expect(isValid).toBe(false);
  });

  it('should identify invalid profile - empty skills', () => {
    const invalidProfile: UserProfile = {
      education: 'Bachelor',
      experience: '3 years',
      skills: [],
      careerGoal: 'Become a developer',
    };

    const isValid = invalidProfile.skills.length > 0;
    expect(isValid).toBe(false);
  });

  it('should identify invalid profile - empty career goal', () => {
    const invalidProfile: UserProfile = {
      education: 'Bachelor',
      experience: '3 years',
      skills: ['JavaScript'],
      careerGoal: '',
    };

    const isValid = invalidProfile.careerGoal.length > 0;
    expect(isValid).toBe(false);
  });

  it('should validate complete profile', () => {
    const validProfile: UserProfile = {
      education: 'Bachelor of Computer Science',
      experience: '3 years as Software Developer',
      skills: ['JavaScript', 'TypeScript', 'React'],
      careerGoal: 'Become a Senior Developer',
    };

    const isValid =
      validProfile.education.length > 0 &&
      validProfile.experience.length > 0 &&
      validProfile.skills.length > 0 &&
      validProfile.careerGoal.length > 0;

    expect(isValid).toBe(true);
  });
});
