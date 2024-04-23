import { ArrayFiller, ComparationUtil, Pattern } from './matcher'
import { isEqual } from './comparator'

const anyComp: ComparationUtil<any> = () => true
anyComp.__kind = 'any'

const stringComp: ComparationUtil<string> = (data: any) =>
    typeof data === 'string'
stringComp.__kind = 'string'

const numberComp: ComparationUtil<number> = (data: any) =>
    typeof data === 'number'
numberComp.__kind = 'number'

const booleanComp: ComparationUtil<boolean> = (data: any) =>
    typeof data === 'boolean'
booleanComp.__kind = 'boolean'

const functionComp: ComparationUtil<(...args: any[]) => any> = (data: any) =>
    typeof data === 'function'
functionComp.__kind = 'function'

const bigintComp: ComparationUtil<bigint> = (data: any) =>
    typeof data === 'bigint'
bigintComp.__kind = 'bigint'

const notComp = <T>(target: Pattern<T>) => {
    const notLogic: ComparationUtil<Pattern<T>> = (data) =>
        !isEqual(data, target)
    notLogic.__kind = 'Not'
    return notLogic
}

const andComp = <T>(...target: Pattern<T>[]) => {
    const andLogic: ComparationUtil<Pattern<T>> = (data) =>
        target.every((target) => isEqual(data, target))
    andLogic.__kind = 'And'
    return andLogic
}

const orComp = <T>(...target: Pattern<T>[]) => {
    const orLogic: ComparationUtil<Pattern<T>> = (data) =>
        target.some((target) => isEqual(data, target))
    orLogic.__kind = 'Or'
    return orLogic
}

const optionalComp = <T>(target?: Pattern<T>) => {
    const optionalLogic: ComparationUtil<Pattern<T>> = (data: any) =>
        data === null || data === undefined || isEqual(data, target)
    optionalLogic.__kind = 'Not'
    return optionalLogic
}

const whenComp = <T>(callback: (input: T) => boolean) => {
    const whenLogic: ComparationUtil<T> = (data) => callback(data)
    whenLogic.__kind = 'When'
    return whenLogic
}

const instanceOfComp = (target: new (...args: any) => any) => {
    const instanceOfLogic: ComparationUtil<
        (new (...args: any) => any) | object
    > = (data) => data instanceof target
    instanceOfLogic.__kind = 'InstanceOf'
    return instanceOfLogic
}

const arrFiller = <T extends any[]>(data: Pattern<UnwrapArray<T>>) => {
    const obj: ArrayFiller<Pattern<UnwrapArray<T>>> = {
        data,
        __kind: 'ArrFiller',
    }
    return [obj]
}

type UnwrapArray<T> = T extends Array<infer U> ? U : never

const arrayComp = <T extends any[]>(...args: Pattern<UnwrapArray<T>>[]) => {
    const arrayLogic: ComparationUtil<Pattern<T>> = (data) => {
        if (!Array.isArray(data)) return false
        if (Array.isArray(data) && args.length === 0) return true
        if (args.length === 1) {
            const arr = new Array(data.length).fill(args[0])
            return isEqual(data, arr)
        }
        const arrFillIndex = args.findIndex(
            (e) => (e as any).__kind === 'ArrFiller',
        )
        if (arrFillIndex === -1)
            throw new Error(
                'You have more than 1 pattern and not and array filler',
            )
        args.splice(
            arrFillIndex,
            1,
            ...new Array(data.length - (args.length - 1)).fill(
                (args[arrFillIndex] as any).data,
            ),
        )
        return isEqual(data, args)
    }
    arrayLogic.__kind = 'Array'
    return arrayLogic
}

type UnwrapSet<T> = T extends Set<infer U> ? U : never

const setComp = <T extends Set<any>>(comp: ComparationUtil<UnwrapSet<T>>) => {
    const setLogic: ComparationUtil<Pattern<T>> = (data: any) => {
        if (!(data instanceof Set)) return false
        const values = Array.from(data)
        const verifiers = new Array(values.length).fill(comp)
        return isEqual(values, verifiers)
    }
    setLogic.__kind = 'Set'
    return setLogic
}

type UnwrapKey<T> = T extends Map<infer U, any> ? U : never
type UnwrapValue<T> = T extends Map<any, infer U> ? U : never

const mapComp = <T extends Map<any, any>>(
    key: ComparationUtil<Pattern<UnwrapKey<T>>>,
    value: ComparationUtil<Pattern<UnwrapValue<T>>>,
) => {
    const mapLogic: ComparationUtil<Pattern<T>> = (data: any) => {
        if (!(data instanceof Map)) return false
        const values = Array.from(data)
        const verifiers = new Array(values.length).fill([key, value])
        return isEqual(values, verifiers)
    }
    mapLogic.__kind = 'Map'
    return mapLogic
}

export const ComparationUtils = {
    Any: anyComp,
    String: stringComp,
    Number: numberComp,
    Boolean: booleanComp,
    BigInt: bigintComp,
    Not: notComp,
    Optional: optionalComp,
    When: whenComp,
    And: andComp,
    Or: orComp,
    InstanceOf: instanceOfComp,
    Array: arrayComp,
    ArrayFiller: arrFiller,
    Set: setComp,
    Map: mapComp,
    Function: functionComp,
}
