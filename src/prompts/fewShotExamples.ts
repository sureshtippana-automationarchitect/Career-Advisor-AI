import { FewShotExample } from '../models/interfaces.js';

/**
 * Few-Shot Examples for Career Advisor AI
 * These examples demonstrate expected input-output patterns for the AI model
 */
export const FEW_SHOT_EXAMPLES: FewShotExample[] = [
  {
    profile: {
      education: 'Bachelor of Computer Science',
      experience: '2 years as Junior Software Developer',
      skills: ['JavaScript', 'React', 'Node.js', 'Git', 'REST APIs'],
      careerGoal: 'Become a Full Stack Developer at a tech company',
    },
    expectedRecommendations: [
      'Full Stack Developer',
      'Frontend Developer',
      'Backend Developer',
    ],
  },
  {
    profile: {
      education: 'MBA in Marketing',
      experience: '3 years in Digital Marketing',
      skills: [
        'SEO',
        'Google Ads',
        'Social Media Marketing',
        'Content Strategy',
        'Analytics',
      ],
      careerGoal: 'Lead marketing campaigns for global brands',
    },
    expectedRecommendations: [
      'Digital Marketing Manager',
      'Growth Marketing Manager',
      'Marketing Strategy Consultant',
    ],
  },
  {
    profile: {
      education: 'Bachelor of Science in Data Science',
      experience: '1 year internship in data analysis',
      skills: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Data Visualization'],
      careerGoal: 'Work as a Data Scientist in AI/ML field',
    },
    expectedRecommendations: [
      'Junior Data Scientist',
      'Machine Learning Engineer',
      'Data Analyst',
    ],
  },
  {
    profile: {
      education: 'Bachelor of Business Administration',
      experience: '5 years as Business Analyst',
      skills: [
        'Requirements Gathering',
        'Process Mapping',
        'SQL',
        'Tableau',
        'Stakeholder Management',
      ],
      careerGoal: 'Transition into Product Management',
    },
    expectedRecommendations: [
      'Product Manager',
      'Senior Business Analyst',
      'Product Owner',
    ],
  },
  {
    profile: {
      education: 'Bachelor of Arts in Graphic Design',
      experience: '4 years as UI/UX Designer',
      skills: [
        'Figma',
        'Adobe XD',
        'User Research',
        'Wireframing',
        'Prototyping',
        'Design Systems',
      ],
      careerGoal: 'Lead design teams and create user-centered products',
    },
    expectedRecommendations: [
      'Senior UX Designer',
      'Product Designer',
      'UX Design Lead',
    ],
  },
];

/**
 * Formats few-shot examples into a string format for prompt inclusion
 * This function converts the array of example objects into a formatted text string
 * that can be included in the AI prompt
 */
export function formatFewShotExamples(): string {
  // .map() transforms each example in the array into a formatted string
  // It takes each example and its index (0, 1, 2, etc.) as parameters
  return FEW_SHOT_EXAMPLES.map((example, index) => {
    // Extract the profile object from the current example for easier access
    const profile = example.profile;
    
    // Build a formatted string for this example
    // ${} syntax is called template literals - it inserts variables into strings
    // index + 1 makes it human-readable (Example 1, 2, 3 instead of 0, 1, 2)
    return `Example ${index + 1}:
Education: ${profile.education}
Experience: ${profile.experience}
Skills: ${profile.skills.join(', ')}
Career Goal: ${profile.careerGoal}

Recommended Roles: ${example.expectedRecommendations.join(', ')}
`;
  }).join('\n---\n\n');
  // .join() combines all the formatted examples into one string
  // separated by "---" dividers between each example
}
