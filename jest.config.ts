// eslint-disable-next-line import/no-extraneous-dependencies
import { pathsToModuleNameMapper } from 'ts-jest/utils';
import { compilerOptions } from './tsconfig.json';

export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/services/**/*.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text-summary',
    'lcov',
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/*.spec.ts',
  ],
  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths, { prefix: '<rootDir>/src/' },
  ),
};
