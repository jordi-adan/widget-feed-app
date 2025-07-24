module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/app.ts', // Exclude main app file (integration tests would cover this)
    '!src/routes/**/*.ts', // Exclude route files (covered by controller tests)
    '!src/**/*.test.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  // Coverage thresholds - currently set to current levels, will increase gradually
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 60,
      lines: 75,
      statements: 75
    }
  }
};
