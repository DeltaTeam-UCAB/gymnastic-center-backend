import { initializeTests } from './loader'
import { raisinsTestSuitDeclartion } from './declaration/test.declaration'
import { raisinsTestingExpectation } from './expectation/expectatation'

export const suiteDeclare = raisinsTestSuitDeclartion
export const lookFor = raisinsTestingExpectation
export const loader = initializeTests
