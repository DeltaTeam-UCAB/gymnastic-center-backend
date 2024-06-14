import { avaTestSuitDeclartion } from './declaration/test.declaration'
import { avaExpectation } from './expectation/expectatation'
import { initializeTests } from './loader'

export const suiteDeclare = avaTestSuitDeclartion
export const lookFor = avaExpectation
export const loader = initializeTests
