import { jasmineTestSuitDeclartion } from './declaration/test.declaration'
import { jasmineExpectation } from './expectation/expectatation'
import { initializeTests } from './loader'

export const suiteDeclare = jasmineTestSuitDeclartion
export const lookFor = jasmineExpectation
export const loader = initializeTests
