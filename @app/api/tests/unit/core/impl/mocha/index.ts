import { mochaTestSuitDeclartion } from './declaration/test.declaration'
import { mochaTestingExpectation } from './expectation/expectatation'
import { initializeTests } from './loader'

export const suiteDeclare = mochaTestSuitDeclartion
export const lookFor = mochaTestingExpectation
export const loader = initializeTests
