export type ExpectationContract = <T = any>(
    value: T,
) => {
    equals(value: T): void
    notEquals(value: T): void
    toHaveLenght: T extends any[] | object ? (number: number) => void : never
    toNotHaveLenght: T extends any[] | object ? (number: number) => void : never
    toHavePropety: T extends object
        ? (path: string | string[], valueInPath?: any) => void
        : never
    toNotHavePropety: T extends object
        ? (path: string | string[], valueInPath?: any) => void
        : never
    toCloseTo: T extends number ? (number: number) => void : never
    toBeDefined: () => void
    toBeFalsy: () => void
    toBeGreaterThan: T extends number | bigint
        ? (number: number | bigint) => void
        : never
    toNotBeGreaterThan: T extends number | bigint
        ? (number: number | bigint) => void
        : never
    toBeGreaterThanOrEqual: T extends number | bigint
        ? (number: number | bigint) => void
        : never
    toNotBeGreaterThanOrEqual: T extends number | bigint
        ? (number: number | bigint) => void
        : never
    toBeLessThan: T extends number | bigint
        ? (number: number | bigint) => void
        : never
    toNotBeLessThan: T extends number | bigint
        ? (number: number | bigint) => void
        : never
    toBeLessThanOrEqual: T extends number | bigint
        ? (number: number | bigint) => void
        : never
    toNotBeLessThanOrEqual: T extends number | bigint
        ? (number: number | bigint) => void
        : never
    toBeNull: () => void
    toNotBeNull: () => void
    toBeTruthy: () => void
    toBeUndefined: () => void
    toBeNaN: () => void
    toNotBeNaN: () => void
    toDeepEqual: T extends object ? (valueToCompare: object) => void : never
    toMatch: T extends string ? (regExp: string | RegExp) => void : never
    toNotMatch: T extends string ? (regExp: string | RegExp) => void : never
    toMathObject: T extends object ? (valueToCompare: object) => void : never
    toBeError: (error?: Error | string) => void
    asyncResolve: T extends Promise<any>
        ? (manager?: (value: Awaited<T>) => void) => Promise<void>
        : never
    asyncReject: T extends Promise<any>
        ? <U = unknown>(manager?: (err: U) => void) => Promise<void>
        : never
}
