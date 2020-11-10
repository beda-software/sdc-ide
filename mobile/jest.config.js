module.exports = {
    preset: 'react-native',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    rootDir: '.',
    setupFilesAfterEnv: ['./src/setupTests.ts'],
    collectCoverage: false,
    collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**', '!**/embed/**', '!**/contrib/**'],
    coverageDirectory: './htmlcov',
    coverageReporters: ['text', 'text-summary', 'html'],
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)'],
    transformIgnorePatterns: ['node_modules/'],
};
