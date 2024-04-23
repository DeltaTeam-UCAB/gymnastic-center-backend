import { ExpectationContract } from '@mono/test-utils'
import { expect } from '@jest/globals'

export const jestExpectation: ExpectationContract = (value) => ({
    equals: ((valueToCompare) => expect(value).toBe(valueToCompare)) as any,
    notEquals: ((valueToCompare) =>
        expect(value).not.toBe(valueToCompare)) as any,
    toHaveLenght: ((number: number) =>
        expect(value).toHaveLength(number)) as any,
    toNotHaveLenght: ((number: number) =>
        expect(value).not.toHaveLength(number)) as any,
    toHavePropety: ((path: string | string[], valueInPath?: any) =>
        expect(value).toHaveProperty(path, valueInPath)) as any,
    toNotHavePropety: ((path: string | string[], valueInPath?: any) =>
        expect(value).not.toHaveProperty(path, valueInPath)) as any,
    toCloseTo: ((number: number) => expect(value).toBeCloseTo(number)) as any,
    toBeDefined: (() => expect(value).toBeDefined()) as any,
    toBeFalsy: (() => expect(value).toBeFalsy()) as any,
    toBeGreaterThan: ((number: number | bigint) =>
        expect(value).toBeGreaterThan(number)) as any,
    toNotBeGreaterThan: ((number: number | bigint) =>
        expect(value).not.toBeGreaterThan(number)) as any,
    toBeGreaterThanOrEqual: ((number: number | bigint) =>
        expect(value).toBeGreaterThanOrEqual(number)) as any,
    toNotBeGreaterThanOrEqual: ((number: number | bigint) =>
        expect(value).not.toBeGreaterThanOrEqual(number)) as any,
    toBeLessThan: ((number: number | bigint) =>
        expect(value).toBeLessThan(number)) as any,
    toNotBeLessThan: ((number: number | bigint) =>
        expect(value).not.toBeLessThan(number)) as any,
    toBeLessThanOrEqual: ((number: number | bigint) =>
        expect(value).toBeLessThanOrEqual(number)) as any,
    toNotBeLessThanOrEqual: ((number: number | bigint) =>
        expect(value).not.toBeLessThanOrEqual(number)) as any,
    toBeNull: () => expect(value).toBeNull(),
    toNotBeNull: () => expect(value).not.toBeNull(),
    toBeTruthy: () => expect(value).toBeTruthy(),
    toBeUndefined: () => expect(value).toBeUndefined(),
    toBeNaN: () => expect(value).toBeNaN(),
    toNotBeNaN: () => expect(value).not.toBeNaN(),
    toDeepEqual: ((valueToCompare: object) =>
        expect(value).toEqual(valueToCompare)) as any,
    toMatch: ((regExp: string | RegExp) =>
        expect(value).toMatch(regExp)) as any,
    toNotMatch: ((regExp: string | RegExp) =>
        expect(value).not.toMatch(regExp)) as any,
    toMathObject: ((valueToCompare: object) =>
        expect(value).toMatchObject(valueToCompare as any)) as any,
    toBeError: (error?: Error | string) => expect(value).toThrow(error),
    asyncReject: (async (manager) => {
        try {
            await value
            throw new Error('Promise not reject')
        } catch (error) {
            manager?.(error)
        }
    }) as any,
    asyncResolve: (async (manager) => {
        try {
            const res = await value
            manager?.(res as unknown as any)
        } catch (error) {
            throw new Error('Promise reject')
        }
    }) as any,
})
