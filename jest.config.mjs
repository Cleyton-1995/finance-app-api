/** @type {import('jest').Config} */
const config = {
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/generated/**', // ignora arquivos gerados
        '!src/**/node_modules/**',
    ],
};

export default config;
