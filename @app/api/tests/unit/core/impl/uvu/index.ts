import { uvuTestSuitDeclartion } from './declaration/test.declaration'
import { uvuExpectation } from './expectation/expectatation'
import { initializeTests } from './loader'

export const suiteDeclare = uvuTestSuitDeclartion
export const lookFor = uvuExpectation
export const loader = initializeTests
