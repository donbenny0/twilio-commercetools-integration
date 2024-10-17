module.exports = {
  displayName: 'Tests Typescript Application - Event',
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.cjs'],
  testPathIgnorePatterns: ['./build'],
  verbose: true,
};
