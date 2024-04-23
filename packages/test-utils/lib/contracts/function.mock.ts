import { ArgumentTypes } from '@mono/types-utils'

export type MockFunction<T extends Function, R> = {
    (...args: ArgumentTypes<T>): R
    calls: {
        args: ArgumentTypes<T>
        returnValue: R
    }[]
    customReturns: R[]
    currentCustomReturn: number
    addCustomReturn(data: R): void
    cleanCustomReturns(): void
}

export type MockFunctionAsync<T extends Function, R> = {
    (...args: ArgumentTypes<T>): Promise<R>
    calls: {
        args: ArgumentTypes<T>
        returnValue: R
    }[]
    customReturns: R[]
    currentCustomReturn: number
    addCustomReturn(data: R): void
    cleanCustomReturns(): void
}
