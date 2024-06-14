import { tapTestSuitDeclartion } from './declaration/test.declaration'
import { tapExpectation } from './expectation/expectatation'
import { initializeTests } from './loader'

export const suiteDeclare = tapTestSuitDeclartion
export const lookFor = tapExpectation
export const loader = initializeTests
