import { Config } from 'jest'

export default <Config>{
    transform: {},
    testEnvironment: 'node',
    rootDir: '../../../../suits',
    testRegex: '.suit.tests.js$',
    // setupFiles: ['../core/impl/jest/runner/setup.js'],
}
