import { tapeTestSuitDeclartion } from './declaration/test.declaration'
import { tapeExpectation } from './expectation/expectatation'
import { initializeTests } from './loader'

export const suiteDeclare = tapeTestSuitDeclartion
export const lookFor = tapeExpectation
export const loader = initializeTests
