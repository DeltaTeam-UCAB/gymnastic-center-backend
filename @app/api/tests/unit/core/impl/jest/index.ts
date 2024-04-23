import { jestSuitDeclartion } from './declaration/test.declaration'
import { jestExpectation } from './expectation/test.expectation'
import { initializeTests } from './loader'

export const suiteDeclare = jestSuitDeclartion
export const lookFor = jestExpectation
export const loader = initializeTests
