import { vitestSuitDeclartion } from './declaration/test.declaration'
import { vitestExpectation } from './expectation/test.expectation'
import { initializeTests } from './loader'

export const suiteDeclare = vitestSuitDeclartion
export const lookFor = vitestExpectation
export const loader = initializeTests
