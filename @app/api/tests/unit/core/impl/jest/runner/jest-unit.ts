import { Config } from 'jest'

export default <Config>{
    transform: {},
    testEnvironment: 'node',
    rootDir: './',
    testRegex: 'run.js$',
    setupFiles: ['./setup.js'],
}
