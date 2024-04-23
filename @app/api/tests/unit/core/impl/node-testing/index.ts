import { initializeTests } from './loader'
import { nodeTestSuitDeclartion } from './declaration/test.declaration'
import { nodeTestingExpectation } from './expectation/expectatation'

export const suiteDeclare = nodeTestSuitDeclartion
export const lookFor = nodeTestingExpectation
export const loader = initializeTests
