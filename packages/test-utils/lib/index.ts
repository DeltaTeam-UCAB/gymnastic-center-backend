import '@mono/array-methods'
import { ExpectationContract } from './contracts/expectation.contract'
import { SuitDeclaration, TestDeclaration } from './contracts/test.declaration'
export * from './mocks/class.mock'
export * from './mocks/function.mock'
export * from './contracts/expectation.contract'
export * from './contracts/function.mock'
export * from './contracts/test.declaration'

declare global {
    const lookFor: ExpectationContract
    const suiteDeclare: SuitDeclaration
    function loader(): Promise<TestDeclaration[]>
}
