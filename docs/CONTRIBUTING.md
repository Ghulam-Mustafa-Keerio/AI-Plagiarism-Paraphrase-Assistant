# Contributing to AI Plagiarism & Paraphrase Assistant

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for everyone. We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of behavior that contributes to a positive environment:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by opening an issue or contacting the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher)
- Git
- A GitHub account
- A Google Gemini API key (for testing)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AI-Plagiarism-Paraphrase-Assistant.git
   cd AI-Plagiarism-Paraphrase-Assistant
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/Ghulam-Mustafa-Keerio/AI-Plagiarism-Paraphrase-Assistant.git
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Set up environment:**
   ```bash
   export API_KEY="your_gemini_api_key"
   ```

6. **Start development server:**
   ```bash
   npm start
   ```

7. **Verify setup:**
   Open http://localhost:3000 in your browser

---

## How to Contribute

### Ways to Contribute

We welcome various types of contributions:

#### 🐛 Bug Reports
Found a bug? Please open an issue with:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, browser)

**Template:**
```markdown
**Bug Description:**
[Clear description of the bug]

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- OS: [e.g., Ubuntu 22.04]
- Node.js: [e.g., v18.0.0]
- Browser: [e.g., Chrome 120]

**Screenshots:**
[If applicable]
```

#### ✨ Feature Requests
Have an idea? Open an issue describing:
- The problem it solves
- Proposed solution
- Alternative solutions considered
- Additional context

**Template:**
```markdown
**Feature Description:**
[Clear description of the feature]

**Problem it Solves:**
[What problem does this address?]

**Proposed Solution:**
[How should it work?]

**Alternatives Considered:**
[Any other approaches?]

**Additional Context:**
[Any other relevant information]
```

#### 📝 Documentation
- Fix typos or unclear sections
- Add examples or tutorials
- Translate documentation
- Improve API documentation

#### 🧪 Testing
- Add test cases
- Improve test coverage
- Report edge cases

#### 🎨 UI/UX Improvements
- Enhance user interface
- Improve accessibility
- Optimize performance
- Add responsive design features

#### 💻 Code Contributions
- Fix bugs
- Implement features
- Refactor code
- Optimize performance

---

## Development Process

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/bug-description

# For documentation
git checkout -b docs/documentation-update
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly

### 3. Test Your Changes

```bash
# Start the application
npm start

# Test source detection
curl -X POST http://localhost:3000/api/detect-source \
  -H "Content-Type: application/json" \
  -d '{"text": "test text"}'

# Test paraphrasing
curl -X POST http://localhost:3000/api/paraphrase \
  -H "Content-Type: application/json" \
  -d '{"text": "test text"}'

# Test UI in browser
# Visit http://localhost:3000
```

### 4. Commit Changes

Follow our [commit guidelines](#commit-guidelines):

```bash
git add .
git commit -m "feat: Add new feature"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template
4. Submit the pull request

---

## Coding Standards

### JavaScript/Node.js

#### ES6+ Features
Use modern JavaScript features:
```javascript
// Good ✓
const fetchData = async () => {
  const response = await fetch(url);
  return response.json();
};

// Avoid ✗
function fetchData() {
  return fetch(url).then(function(response) {
    return response.json();
  });
}
```

#### Import/Export
Use ES6 modules:
```javascript
// Good ✓
import express from 'express';
export default myFunction;

// Avoid ✗
const express = require('express');
module.exports = myFunction;
```

#### Naming Conventions
```javascript
// Variables and functions: camelCase
const userName = 'John';
function getUserData() {}

// Constants: UPPER_SNAKE_CASE
const API_KEY = process.env.API_KEY;
const MAX_RETRIES = 3;

// Classes: PascalCase
class UserManager {}
```

#### Code Style
```javascript
// Use descriptive variable names
// Good ✓
const userAnalysisResult = analyzeText(inputText);

// Avoid ✗
const result = analyze(text);

// Use arrow functions for callbacks
// Good ✓
array.map(item => item.value);

// Use template literals
// Good ✓
const message = `Hello, ${userName}!`;

// Avoid ✗
const message = 'Hello, ' + userName + '!';

// Destructuring
// Good ✓
const { text, analysis } = response;

// Error handling
// Good ✓
try {
  const result = await riskyOperation();
} catch (error) {
  console.error('Error:', error.message);
  throw new Error('Operation failed');
}
```

### HTML

```html
<!-- Use semantic HTML -->
<section class="results">
  <header>
    <h2>Analysis Results</h2>
  </header>
  <article class="result-item">
    <!-- Content -->
  </article>
</section>

<!-- Proper indentation -->
<!-- Lowercase tags and attributes -->
<!-- Close all tags -->
```

### CSS

```css
/* Use meaningful class names */
.paraphrase-result {
  /* Properties */
}

/* Group related properties */
.button-primary {
  /* Layout */
  display: flex;
  padding: 10px 20px;
  
  /* Colors */
  background-color: #007bff;
  color: white;
  
  /* Typography */
  font-size: 16px;
  font-weight: bold;
}
```

### Comments

```javascript
/**
 * Detects potential sources of the given text using Gemini API.
 * 
 * @param {string} text - The text to analyze
 * @returns {Promise<Object>} Analysis result with source information
 * @throws {Error} If API request fails
 */
async function detectSource(text) {
  // Implementation
}

// Single-line comments for brief explanations
const confidenceThreshold = 70; // Minimum confidence for high-confidence sources
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements

### Examples

```bash
# Feature
feat(api): Add batch processing endpoint

# Bug fix
fix(paraphrase): Handle empty text input correctly

# Documentation
docs(readme): Update installation instructions

# Refactor
refactor(server): Extract API routes to separate file

# Style
style(frontend): Format code with Prettier

# Chore
chore(deps): Update dependencies to latest versions
```

### Commit Message Guidelines

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Capitalize first letter
- No period at the end
- Limit first line to 72 characters
- Reference issues and pull requests when relevant

```bash
# Good ✓
git commit -m "feat: Add support for multiple languages"

# Good ✓ (with body)
git commit -m "fix: Resolve API timeout issue

Added retry logic with exponential backoff.
Increased timeout from 5s to 30s.

Fixes #123"

# Avoid ✗
git commit -m "updated stuff"
git commit -m "Fixed bug."
```

---

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test thoroughly:**
   - Test all affected functionality
   - Verify no regressions
   - Test in different browsers (if UI changes)

3. **Update documentation** if needed:
   - Update README.md
   - Update API.md for API changes
   - Add inline code comments

4. **Clean up commits** if necessary:
   ```bash
   git rebase -i HEAD~3  # Interactive rebase last 3 commits
   ```

### Pull Request Template

```markdown
## Description
[Describe your changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Testing
[Describe how you tested these changes]

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed my own code
- [ ] Commented complex code sections
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tested changes
- [ ] Checked browser compatibility (if applicable)

## Related Issues
Fixes #[issue number]
```

### Review Process

1. **Automated checks**: Ensure all checks pass
2. **Code review**: Address reviewer feedback
3. **Discussion**: Participate in discussion
4. **Approval**: Wait for maintainer approval
5. **Merge**: Maintainer will merge when ready

### After Merge

1. **Delete your branch:**
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your fork:**
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

---

## Testing

### Manual Testing

Always test your changes manually:

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Test source detection:**
   - Enter sample text
   - Click "Detect Sources"
   - Verify results are correct

3. **Test paraphrasing:**
   - Enter text to paraphrase
   - Click "Paraphrase"
   - Verify output quality

4. **Test edge cases:**
   - Empty input
   - Very long text
   - Special characters
   - Multiple languages (if supported)

### API Testing

```bash
# Test source detection
curl -X POST http://localhost:3000/api/detect-source \
  -H "Content-Type: application/json" \
  -d '{"text": "Climate change is one of the most pressing issues."}'

# Test paraphrasing
curl -X POST http://localhost:3000/api/paraphrase \
  -H "Content-Type: application/json" \
  -d '{"text": "Machine learning is transforming industries."}'

# Test error handling
curl -X POST http://localhost:3000/api/paraphrase \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Documentation

### When to Update Documentation

- Adding new features
- Changing existing behavior
- Modifying APIs
- Adding configuration options
- Fixing bugs that affect usage

### Documentation Files

- **README.md**: Main documentation
- **docs/API.md**: API reference
- **docs/DEPLOYMENT.md**: Deployment guides
- **docs/CONTRIBUTING.md**: This file
- **Code comments**: Inline documentation

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Use proper markdown formatting
- Keep it up-to-date

---

## Questions?

If you have questions about contributing:

1. **Check existing documentation**
2. **Search existing issues**
3. **Open a new issue** with the "question" label
4. **Start a discussion** in GitHub Discussions

---

## Recognition

Contributors will be recognized in several ways:

- Listed in repository contributors
- Mentioned in release notes
- Added to CONTRIBUTORS.md (if we create one)
- Appreciation in the community

---

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

---

Thank you for contributing to the AI Plagiarism & Paraphrase Assistant! 🎉
