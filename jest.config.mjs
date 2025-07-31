/** @type {import('jest').Config} */
const config = {
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/generated/**', // ignora arquivos gerados
        '!src/**/node_modules/**',
    ],
    globalSetup: '<rootDir>/jest.global-setup.mjs',
};

export default config;
