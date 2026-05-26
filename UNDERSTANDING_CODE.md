# Understanding the Code - Guide for QA Automation Engineers

This guide explains common JavaScript/TypeScript concepts used in this project.

## Table of Contents
- [Array Methods](#array-methods)
- [Async/Await](#asyncawait)
- [Regular Expressions (Regex)](#regular-expressions-regex)
- [TypeScript Concepts](#typescript-concepts)
- [Operators](#operators)

---

## Array Methods

### .map()
**Purpose**: Transforms each item in an array into something new

**Example**:
```typescript
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
// Result: [2, 4, 6]

// In our project:
const skills = ['JavaScript', 'Python', 'React'];
const uppercase = skills.map(skill => skill.toUpperCase());
// Result: ['JAVASCRIPT', 'PYTHON', 'REACT']
```

**In Project**: Used to transform recommendations into strings for validation
```typescript
const contentToValidate = careerAdvice.recommendations.map(
  (rec) => `${rec.role} ${rec.explanation}`
);
// Transforms [{role: 'Developer', explanation: '...'}, ...]
// Into: ['Developer ...', ...]
```

---

### .filter()
**Purpose**: Keeps only items that match a condition

**Example**:
```typescript
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = numbers.filter(n => n % 2 === 0);
// Result: [2, 4]

// In our project:
const skills = ['JavaScript', '', 'Python', '  ', 'React'];
const validSkills = skills.filter(s => s.length > 0);
// Result: ['JavaScript', 'Python', '  ', 'React']
```

---

### .forEach()
**Purpose**: Executes a function for each item in an array

**Example**:
```typescript
const names = ['Alice', 'Bob', 'Charlie'];
names.forEach((name, index) => {
  console.log(`${index + 1}. ${name}`);
});
// Output:
// 1. Alice
// 2. Bob
// 3. Charlie
```

**In Project**: Used to display each recommendation
```typescript
recommendations.forEach((rec, index) => {
  console.log(`\n${index + 1}. ${rec.role}`);
  console.log(`   Suitability Score: ${rec.suitabilityScore}/100`);
});
```

---

### .join()
**Purpose**: Combines array items into a single string

**Example**:
```typescript
const words = ['Hello', 'World'];
const sentence = words.join(' ');
// Result: 'Hello World'

// In our project:
const skills = ['JavaScript', 'Python', 'React'];
const skillsList = skills.join(', ');
// Result: 'JavaScript, Python, React'
```

---

### .split()
**Purpose**: Breaks a string into an array based on a delimiter

**Example**:
```typescript
const text = 'JavaScript,Python,React';
const skills = text.split(',');
// Result: ['JavaScript', 'Python', 'React']

// In our project:
const skillsInput = 'JavaScript, Python, React';
const skillsArray = skillsInput.split(',');
// Result: ['JavaScript', ' Python', ' React']
```

---

### .push()
**Purpose**: Adds an item to the end of an array

**Example**:
```typescript
const numbers = [1, 2, 3];
numbers.push(4);
// numbers is now: [1, 2, 3, 4]

// In our project:
const issues = [];
issues.push('Bias detected');
issues.push('Offensive language found');
// issues is now: ['Bias detected', 'Offensive language found']
```

---

### .slice()
**Purpose**: Extracts a portion of an array

**Example**:
```typescript
const numbers = [1, 2, 3, 4, 5];
const first3 = numbers.slice(0, 3);
// Result: [1, 2, 3]

// In our project:
recommendations.slice(0, 3)
// Ensures we only return the first 3 recommendations
```

---

## Async/Await

### What is async/await?
**Purpose**: Handles operations that take time (API calls, file reading, etc.) without freezing the application

**Without async/await** (older way):
```typescript
fetchData()
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
```

**With async/await** (modern way):
```typescript
async function getData() {
  try {
    const result = await fetchData();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
```

### In Our Project:
```typescript
// Waiting for OpenAI API response
async generateCareerAdvice(profile: UserProfile) {
  // 'await' pauses here until OpenAI responds
  const completion = await this.openai.chat.completions.create({...});
  return completion;
}

// Waiting for user input
async collectUserProfile() {
  // 'await' pauses here until user types and presses Enter
  const education = await this.prompt('Education: ');
  return { education, ... };
}
```

**Key Points**:
- `async` keyword: Makes a function return a Promise
- `await` keyword: Pauses execution until the Promise resolves
- Must use `await` inside an `async` function
- Allows writing asynchronous code that looks synchronous

---

## Regular Expressions (Regex)

### What are Regular Expressions?
**Purpose**: Patterns for matching and searching text

### Basic Syntax:
```typescript
/pattern/flags

// Example:
/cat/i  // Matches "cat", "Cat", "CAT" (i = case-insensitive)
```

### Common Patterns:
```typescript
\b      // Word boundary (start/end of word)
\s      // Whitespace (space, tab, newline)
\w      // Word character (letter, digit, underscore)
+       // One or more times
*       // Zero or more times
?       // Optional (zero or one time)
|       // OR operator
()      // Group
[]      // Character set
```

### In Our Project:
```typescript
// Detects "men are better" or "women are superior"
/\b(men|women)\s+(are\s+)?(better|superior)\b/i

Breaking it down:
\b          // Word boundary
(men|women) // Match "men" OR "women"
\s+         // One or more spaces
(are\s+)?   // Optional "are " with spaces
(better|superior) // Match "better" OR "superior"
\b          // Word boundary
i           // Case-insensitive flag
```

### Testing Regex:
```typescript
const pattern = /\bcat\b/i;
pattern.test('I have a cat');     // true
pattern.test('I have a dog');     // false
pattern.test('Cat is sleeping');  // true (case-insensitive)
```

---

## TypeScript Concepts

### Interfaces
**Purpose**: Define the shape/structure of an object

```typescript
// Define the structure
interface UserProfile {
  education: string;
  experience: string;
  skills: string[];
  careerGoal: string;
}

// Use the structure
const profile: UserProfile = {
  education: 'Bachelor of CS',
  experience: '3 years',
  skills: ['JavaScript', 'Python'],
  careerGoal: 'Senior Developer'
};
```

### Types
```typescript
string    // Text: 'hello'
number    // Numbers: 42, 3.14
boolean   // true or false
string[]  // Array of strings: ['a', 'b', 'c']
any       // Any type (avoid when possible)
void      // No return value
```

### Type Annotations:
```typescript
// Variable types
const name: string = 'John';
const age: number = 30;
const isActive: boolean = true;

// Function types
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Async function that returns Promise
async function fetchData(): Promise<string> {
  return 'data';
}
```

---

## Operators

### Ternary Operator (? :)
**Purpose**: Shorthand if-else statement

**Syntax**: `condition ? valueIfTrue : valueIfFalse`

```typescript
// Traditional if-else
let message;
if (age >= 18) {
  message = 'Adult';
} else {
  message = 'Minor';
}

// Ternary operator (same result)
const message = age >= 18 ? 'Adult' : 'Minor';
```

**In Project**:
```typescript
const skillGaps = rec.skillGaps.length > 0 
  ? rec.skillGaps.join(', ')  // If there are skills
  : 'None';                   // If no skills
```

---

### Optional Chaining (?.)
**Purpose**: Safely access nested properties without crashing

```typescript
// Without optional chaining (can crash)
const street = user.address.street;  // Error if address is null

// With optional chaining (safe)
const street = user?.address?.street;  // Returns undefined if null
```

**In Project**:
```typescript
const responseContent = completion.choices[0]?.message?.content;
// If choices[0] is undefined, returns undefined instead of crashing
```

---

### Spread Operator (...)
**Purpose**: Expands an array or object

```typescript
// Combining arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
// Result: [1, 2, 3, 4, 5, 6]

// In our project:
const allPlans = [
  ...roadmap.thirtyDayPlan,   // Add all 30-day items
  ...roadmap.ninetyDayPlan,   // Add all 90-day items
  ...roadmap.sixMonthPlan     // Add all 6-month items
];
```

---

### Logical OR (||)
**Purpose**: Returns first truthy value or last value

```typescript
const name = userName || 'Guest';  // Use userName or 'Guest' if empty

// In our project:
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
// Use env variable or default to 'gpt-4o-mini'
```

---

## Template Literals

### Purpose: Create strings with embedded variables

```typescript
// Old way (string concatenation)
const greeting = 'Hello, ' + name + '!';

// New way (template literals)
const greeting = `Hello, ${name}!`;

// Multi-line strings
const message = `
  Welcome to the app!
  Your name is ${name}.
  Your age is ${age}.
`;
```

---

## Classes and Constructors

### Class
**Purpose**: Blueprint for creating objects with properties and methods

```typescript
class Person {
  // Properties
  private name: string;
  private age: number;
  
  // Constructor - runs when creating new Person()
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  
  // Method
  greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}

// Create an instance
const person = new Person('John', 30);
person.greet();  // "Hello, I'm John"
```

**In Project**:
```typescript
class CareerAdvisorApp {
  private careerAdvisor: CareerAdvisorService;
  
  constructor() {
    // Initialize services when app is created
    this.careerAdvisor = new CareerAdvisorService(apiKey);
  }
  
  async run() {
    // Main application logic
  }
}

// Start the app
const app = new CareerAdvisorApp();
app.run();
```

---

## Common Patterns in Project

### Error Handling
```typescript
try {
  // Try to execute code that might fail
  const result = await someOperation();
} catch (error) {
  // Handle the error if something goes wrong
  console.error('Error:', error.message);
}
```

### Validation Pattern
```typescript
// Check if value exists and is valid
if (!value || value.length === 0) {
  console.error('Error: Value is required');
  return false;
}
return true;
```

### Array Processing Pipeline
```typescript
const skills = skillsInput
  .split(',')              // 1. Split string into array
  .map(s => s.trim())      // 2. Remove spaces from each item
  .filter(s => s.length > 0);  // 3. Remove empty items
```

---

## Quick Reference

### Check if array is empty:
```typescript
if (array.length === 0) { }
if (!array || array.length === 0) { }
```

### Loop through array:
```typescript
// Using forEach
array.forEach((item, index) => { });

// Using for...of
for (const item of array) { }

// Traditional for loop
for (let i = 0; i < array.length; i++) { }
```

### Transform array items:
```typescript
const result = array.map(item => transform(item));
```

### Filter array items:
```typescript
const result = array.filter(item => condition);
```

### Check if condition is true:
```typescript
const result = condition ? valueIfTrue : valueIfFalse;
```

---

## Testing Concepts (Vitest)

### Test Structure:
```typescript
describe('Feature Name', () => {
  it('should do something specific', () => {
    // Arrange: Set up test data
    const input = 'test';
    
    // Act: Execute the code
    const result = someFunction(input);
    
    // Assert: Check the result
    expect(result).toBe('expected');
  });
});
```

### Common Assertions:
```typescript
expect(value).toBe(expected);           // Exact equality
expect(value).toEqual(expected);        // Deep equality (objects/arrays)
expect(value).toBeTruthy();             // Is truthy
expect(value).toBeFalsy();              // Is falsy
expect(array).toHaveLength(3);          // Array has 3 items
expect(value).toBeGreaterThan(5);       // value > 5
expect(array).toContain('item');        // Array contains 'item'
```

---

## Debugging Tips

1. **Console.log is your friend**:
   ```typescript
   console.log('Value:', someVariable);
   console.log('Type:', typeof someVariable);
   ```

2. **Check array contents**:
   ```typescript
   console.log('Array length:', array.length);
   console.log('Array contents:', array);
   ```

3. **Trace execution**:
   ```typescript
   console.log('Starting function...');
   const result = await someOperation();
   console.log('Result:', result);
   ```

4. **Catch errors properly**:
   ```typescript
   try {
     // code
   } catch (error) {
     console.error('Error details:', error);
     console.error('Error message:', error.message);
   }
   ```

---

## Additional Resources

- **MDN Web Docs**: https://developer.mozilla.org/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Regex Tester**: https://regex101.com/
- **Vitest Documentation**: https://vitest.dev/

---

This guide covers the main concepts used in the Career Advisor AI project. If you encounter unfamiliar syntax, refer to this guide or the code comments for clarification.
