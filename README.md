# Career Advisor AI

An AI-powered career advisor console application built with TypeScript and OpenAI API.

## Features

- **User Profile Analysis**: Accepts user education, experience, skills, and career goals
- **Job Recommendations**: Suggests top 3 suitable job roles with explanations
- **Skill Gap Analysis**: Identifies skills needed for recommended roles
- **Learning Roadmap**: Generates 30-day, 90-day, and 6-month learning plans
- **Safety Validation**: Detects and rejects biased or offensive AI outputs
- **Role Prompting**: Uses specialized AI career advisor persona
- **Few-Shot Learning**: Leverages example profiles for better recommendations

## Prerequisites

- Node.js 18+ 
- OpenAI API key

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and add your OpenAI API key:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and set your `OPENAI_API_KEY`

## Usage

Build and run the application:

```bash
npm run dev
```

Or build and run separately:

```bash
npm run build
npm start
```

## Testing

Run tests:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

Generate coverage report:

```bash
npm run test:coverage
```

## Project Structure

```
src/
├── prompts/
│   ├── rolePrompt.ts        # Career Advisor role definition
│   └── fewShotExamples.ts   # 5 example profiles with recommendations
├── services/                # Core business logic
│   ├── CareerAdvisorService.ts      # Job recommendations
│   ├── RoadmapGeneratorService.ts   # Learning roadmaps
│   └── SafetyValidatorService.ts    # Bias & safety detection
├── models/
│   └── interfaces.ts        # TypeScript interfaces
├── tests/                   # Vitest test files
│   ├── UserProfile.test.ts
│   ├── RolePrompt.test.ts
│   ├── FewShotExamples.test.ts
│   └── SafetyValidatorService.test.ts
└── app.ts                   # Main console application
```

## License

MIT

---

## Original Project Requirements
## Prompt for impleneting this project

### Objective
Create a simple TypeScript console application called Career Advisor AI.

### Requirements

**Constraints:**
1. No React
2. No Vite
3. No Express
4. No Database
5. No Authentication

**Technology Stack:**
- Node.js
- TypeScript
- OpenAI API
- dotenv
- Vitest

### Project Objective

Build an AI Career Advisor that:
- Accepts user profile
- Suggests suitable jobs
- Generates learning roadmap
- Detects unsafe or biased output
- Demonstrates role prompting
- Demonstrates few-shot prompting

### Folder Structure

```
src/
 ├── prompts
 ├── services
 ├── models
 ├── tests
 └── app.ts
```

### Implementation Details

#### 1. UserProfile Interface

Fields:
- `education` - Educational background
- `experience` - Work experience
- `skills` - Array of skills
- `careerGoal` - Career aspirations

#### 2. Role Prompt

```
You are an experienced Career Advisor.

Responsibilities:
- Recommend suitable careers
- Explain recommendations
- Avoid bias
- Avoid discrimination
- Use professional language
```

#### 3. Few-Shot Examples

Provide 5 example profiles and expected recommendations.

#### 4. Career Advisor Service

Generate:
- Top 3 job roles
- Skill gaps
- Suitability score (0-100)
- Explanation for each recommendation

#### 5. Roadmap Generator

Generate:
- 30-day plan
- 90-day plan
- 6-month plan

#### 6. Safety Validator

Check AI output for:
- Gender bias
- Race bias
- Age bias
- Offensive language

Reject unsafe responses.

#### 7. Console Application

Prompt user for profile details.

Display:
- Career suggestions
- Roadmap
- Explanation

#### 8. Testing

Use Vitest.

Create tests for:
- Valid profile
- Invalid profile
- Empty skills
- Roadmap generation
- Safety validation
