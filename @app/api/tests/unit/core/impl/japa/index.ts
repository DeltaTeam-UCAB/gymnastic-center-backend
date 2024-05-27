import { initializeTests } from './loader'
import { japaTestSuitDeclartion } from './declaration/test.declaration'
import { japaTestingExpectation } from './expectation/expectatation'

export const suiteDeclare = japaTestSuitDeclartion
export const lookFor = japaTestingExpectation
export const loader = initializeTests
