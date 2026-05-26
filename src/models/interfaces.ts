/**
 * User Profile Interface
 * Represents a user's educational background, experience, skills, and career aspirations
 */
export interface UserProfile {
  education: string;
  experience: string;
  skills: string[];
  careerGoal: string;
}

/**
 * Job Recommendation Interface
 * Represents a single job recommendation with details
 */
export interface JobRecommendation {
  role: string;
  suitabilityScore: number; // 0-100
  skillGaps: string[];
  explanation: string;
}

/**
 * Career Advice Response Interface
 * Contains multiple job recommendations
 */
export interface CareerAdviceResponse {
  recommendations: JobRecommendation[];
}

/**
 * Learning Roadmap Interface
 * Provides structured learning plans over different time periods
 */
export interface LearningRoadmap {
  thirtyDayPlan: string[];
  ninetyDayPlan: string[];
  sixMonthPlan: string[];
}

/**
 * Safety Check Result Interface
 * Contains the result of content safety validation
 */
export interface SafetyCheckResult {
  isSafe: boolean;
  issues: string[];
  message?: string;
}

/**
 * Few-Shot Example Interface
 * Represents example user profiles with expected recommendations
 */
export interface FewShotExample {
  profile: UserProfile;
  expectedRecommendations: string[];
}
