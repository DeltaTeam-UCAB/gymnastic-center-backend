import { ExpectationContract } from '@mono/test-utils'
import assert from 'node:assert'

export const mochaTestingExpectation: ExpectationContract = (value) =>
    ({
        equals: (valueToCompare) => assert.equal(value, valueToCompare),
        notEquals: (valueToCompare) => assert.notEqual(value, valueToCompare),
        toHaveLenght: ((number: number) => {
            if (
                !Array.isArray(value) ||
                typeof (value as any).lenght !== 'number'
            ) {
                throw new Error('Value can not have lenght')
            }
            assert.strictEqual(value.length, number)
        }) as any,
        toNotHaveLenght: ((number: number) => {
            if (
                !Array.isArray(value) ||
                typeof (value as any).lenght !== 'number'
            ) {
                throw new Error('Value can not have lenght')
            }
            assert.notStrictEqual(value.length, number)
        }) as any,
        toHavePropety: ((path: string | string[], valueInPath?: any) => {
            if (!value || typeof value !== 'object') {
                throw new Error('Not valid object to compare')
            }
            if (Array.isArray(path)) {
                path.map((path) => {
                    assert.strictEqual(true, Object.hasOwn(value as any, path))
                    if (valueInPath) {
                        assert.strictEqual(value[path], valueInPath)
                    }
                })
                return
            }
            assert.strictEqual(true, Object.hasOwn(value as any, path))
            if (valueInPath) {
                assert.strictEqual(value[path], valueInPath)
            }
        }) as any,
        toNotHavePropety: ((path: string | string[], valueInPath?: any) => {
            if (!value || typeof value !== 'object') {
                throw new Error('Not valid object to compare')
            }
            if (Array.isArray(path)) {
                path.map((path) => {
                    if (valueInPath) {
                        assert.notStrictEqual(value[path], valueInPath)
                    }
                    assert.strictEqual(false, Object.hasOwn(value as any, path))
                })
                return
            }
            if (valueInPath) {
                assert.notStrictEqual(value[path], valueInPath)
            }
            assert.strictEqual(false, Object.hasOwn(value as any, path))
        }) as any,
        toCloseTo: ((number: number) =>
            expect(value).toBeCloseTo(number)) as any,
        toBeDefined: () => assert.notStrictEqual(value, undefined),
        toBeFalsy: () => assert.strictEqual(Boolean(value), false),
        toBeGreaterThan: ((number: number | bigint) => {
            if (typeof value !== 'number')
                throw new Error('Invalid number to compare')
            if (value <= number)
                throw new Error(`${value} is not greater than ${number}`)
        }) as any,
        toNotBeGreaterThan: (number: number | bigint) => {
            if (typeof value !== 'number')
                throw new Error('Invalid number to compare')
            if (value > number)
                throw new Error(`${value} is greater than ${number}`)
        },
        toBeGreaterThanOrEqual: (number: number | bigint) => {
            if (typeof value !== 'number')
                throw new Error('Invalid number to compare')
            if (value < number)
                throw new Error(
                    `${value} is not greater or equal than ${number}`,
                )
        },
        toNotBeGreaterThanOrEqual: (number: number | bigint) => {
            if (typeof value !== 'number')
                throw new Error('Invalid number to compare')
            if (value > number)
                throw new Error(`${value} is greater or equal than ${number}`)
        },
        toBeLessThan: (number: number | bigint) => {
            if (typeof value !== 'number')
                throw new Error('Invalid number to compare')
            if (value >= number)
                throw new Error(`${value} is not less than ${number}`)
        },
        toNotBeLessThan: (number: number | bigint) => {
            if (typeof value !== 'number')
                throw new Error('Invalid number to compare')
            if (value < number)
                throw new Error(`${value} is less than ${number}`)
        },
        toBeLessThanOrEqual: (number: number | bigint) => {
            if (typeof value !== 'number')
                throw new Error('Invalid number to compare')
            if (value > number)
                throw new Error(`${value} is not less or equal than ${number}`)
        },
        toNotBeLessThanOrEqual: (number: number | bigint) => {
            if (typeof value !== 'number')
                throw new Error('Invalid number to compare')
            if (value <= number)
                throw new Error(`${value} is less or equal than ${number}`)
        },
        toBeNull: () => assert.strictEqual(value, null),
        toNotBeNull: () => assert.notStrictEqual(value, null),
        toBeTruthy: () => assert.strictEqual(Boolean(value), true),
        toBeUndefined: () => assert.strictEqual(value, undefined),
        toBeNaN: () => {
            if (!Number.isNaN(value)) {
                throw new Error('Number is not NaN')
            }
        },
        toNotBeNaN: () => {
            if (Number.isNaN(value)) {
                throw new Error('Number is NaN')
            }
        },
        toDeepEqual: (valueToCompare: object) =>
            assert.deepEqual(value, valueToCompare),
        toMatch: (regExp: string | RegExp) => {
            if (typeof regExp === 'string') {
                if (typeof value === 'string' && !value.includes(regExp))
                    throw new Error(`Pattern ${regExp} not match with ${value}`)
                return
            }
            assert.match(value as any, regExp)
        },
        toNotMatch: (regExp: string | RegExp) => {
            if (typeof regExp === 'string') {
                if (typeof value === 'string' && value.includes(regExp))
                    throw new Error(`Pattern ${regExp} match with ${value}`)
                return
            }
            assert.doesNotMatch(value as any, regExp)
        },
        toMathObject: (valueToCompare: object) =>
            assert.deepEqual(value, valueToCompare),
        toBeError: (error?: Error | string) => {
            try {
                if (typeof value !== 'function')
                    throw new Error('Not a function')
                value()
                throw new Error('The execution not throw an error')
            } catch (e) {
                assert.deepEqual(e, error)
            }
        },
        async asyncReject(manager) {
            try {
                await value
                assert.fail('Promise not reject')
            } catch (error) {
                manager?.(error)
            }
        },
        async asyncResolve(manager) {
            try {
                const res = await value
                manager?.(res as unknown as any)
            } catch (error) {
                assert.fail('Promise reject')
            }
        },
    } as any)
