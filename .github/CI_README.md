# Continuous Integration (CI) Setup

This project uses GitHub Actions for continuous integration to ensure code quality and reliability.

## Workflow Overview

Our CI pipeline (`/.github/workflows/ci.yml`) runs on:
- **Push to main/develop branches**
- **Pull requests to main/develop branches**

## Jobs

### 1. Test Job
- **Node.js versions**: 18.x and 20.x (matrix strategy)
- **Steps**:
  - Checkout code
  - Setup Node.js with npm cache
  - Install dependencies (`npm ci`)
  - Run linting (placeholder for future implementation)
  - Run tests (`npm test`)
  - Run tests with coverage
  - Check coverage threshold
  - Upload coverage to Codecov (Node.js 20.x only)

### 2. Build Job
- **Dependencies**: Runs after test job passes
- **Steps**:
  - Checkout code
  - Setup Node.js 20.x
  - Install dependencies
  - Build project (`npm run build`)
  - Archive build artifacts

## Coverage Requirements

### Current Thresholds
- **Statements**: 75%
- **Branches**: 75%  
- **Functions**: 60%
- **Lines**: 75%

### Target Thresholds (Future)
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

## Coverage Strategy

1. **Excluded from Coverage**:
   - `src/app.ts` - Main application entry point (covered by integration tests)
   - `src/routes/**` - Route files (covered by controller tests)
   - Test files (`**/*.test.ts`)

2. **Focus Areas for Coverage**:
   - Domain entities and value objects
   - Application use cases
   - Controller logic
   - Repository implementations

## Running Tests Locally

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode (no watch)
npm run test:coverage:ci

# Run tests in watch mode
npm run test:watch
```

## Coverage Reports

- **Text**: Displayed in terminal
- **LCOV**: Generated for Codecov integration
- **HTML**: Generated in `coverage/` directory for local viewing

## Future Improvements

1. **ESLint Integration**: Add linting checks
2. **Prettier Integration**: Add code formatting checks
3. **Security Scanning**: Add dependency vulnerability checks
4. **Performance Testing**: Add performance benchmarks
5. **Coverage Increase**: Gradually increase thresholds to 80%

## Badge Status

Once set up, you can add these badges to your README:

```markdown
![CI](https://github.com/jordi-adan/widget-feed-app/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/jordi-adan/widget-feed-app/branch/main/graph/badge.svg)](https://codecov.io/gh/jordi-adan/widget-feed-app)
```
