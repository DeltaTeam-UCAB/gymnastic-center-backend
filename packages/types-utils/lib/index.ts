export type Dictionary<T> = {
    [key: string]: T
}

export type TypeClass<T, U = any> = {
    new (...args: U[]): T
}

export type Optional<T> = T | undefined | null

export type ArgumentTypes<F extends Function> = F extends (
    ...args: infer A
) => any
    ? A
    : never

export type ReturnType<F extends Function> = F extends (
    ...args: any[]
) => infer R
    ? R
    : never

export type PickMatching<T, V> = {
    [K in keyof T as T[K] extends V ? K : never]: T[K]
}

export type ExtractMethods<T> = PickMatching<T, Function>

type ParamsTransformer<T> = T extends any[] ? T : T[]

type OperatorFunction<P, R> = (...args: ParamsTransformer<P>) => R
type OperatorFunctionAsync<P, R> = (...args: ParamsTransformer<P>) => Promise<R>

export function pipe<T>(initial: T): T
export function pipe<T, A>(initial: T, op1: OperatorFunction<T, A>): A
export function pipe<T, A, B>(
    initial: T,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
): B
export function pipe<T, A, B, C>(
    initial: T,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
): C
export function pipe<T, A, B, C, D>(
    initial: T,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
): D
export function pipe<T, A, B, C, D, E>(
    initial: T,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
): E
export function pipe<T, A, B, C, D, E, F>(
    initial: T,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
): F
export function pipe<T, A, B, C, D, E, F, G>(
    initial: T,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>,
): G
export function pipe<T, A, B, C, D, E, F, G, H>(
    initial: T,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>,
    op8: OperatorFunction<G, H>,
): H
export function pipe<T, A, B, C, D, E, F, G, H, I>(
    initial: T,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>,
    op8: OperatorFunction<G, H>,
    op9: OperatorFunction<H, I>,
): I
export function pipe<T, A, B, C, D, E, F, G, H, I>(
    initial: T,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>,
    op8: OperatorFunction<G, H>,
    op9: OperatorFunction<H, I>,
    ...operations: OperatorFunction<any, any>[]
): unknown
export function pipe(initial: any, ...fns: any[]) {
    return fns.reduce((output, f) => f(output), initial)
}

export function asyncPipe<T>(initial: T): Promise<T>
export function asyncPipe<T, A>(
    initial: T,
    op1: OperatorFunctionAsync<T, A>,
): Promise<A>
export function asyncPipe<T, A, B>(
    initial: T,
    op1: OperatorFunctionAsync<T, A>,
    op2: OperatorFunctionAsync<A, B>,
): Promise<B>
export function asyncPipe<T, A, B, C>(
    initial: T,
    op1: OperatorFunctionAsync<T, A>,
    op2: OperatorFunctionAsync<A, B>,
    op3: OperatorFunctionAsync<B, C>,
): Promise<C>
export function asyncPipe<T, A, B, C, D>(
    initial: T,
    op1: OperatorFunctionAsync<T, A>,
    op2: OperatorFunctionAsync<A, B>,
    op3: OperatorFunctionAsync<B, C>,
    op4: OperatorFunctionAsync<C, D>,
): D
export function asyncPipe<T, A, B, C, D, E>(
    initial: T,
    op1: OperatorFunctionAsync<T, A>,
    op2: OperatorFunctionAsync<A, B>,
    op3: OperatorFunctionAsync<B, C>,
    op4: OperatorFunctionAsync<C, D>,
    op5: OperatorFunctionAsync<D, E>,
): Promise<E>
export function asyncPipe<T, A, B, C, D, E, F>(
    initial: T,
    op1: OperatorFunctionAsync<T, A>,
    op2: OperatorFunctionAsync<A, B>,
    op3: OperatorFunctionAsync<B, C>,
    op4: OperatorFunctionAsync<C, D>,
    op5: OperatorFunctionAsync<D, E>,
    op6: OperatorFunctionAsync<E, F>,
): Promise<F>
export function asyncPipe<T, A, B, C, D, E, F, G>(
    initial: T,
    op1: OperatorFunctionAsync<T, A>,
    op2: OperatorFunctionAsync<A, B>,
    op3: OperatorFunctionAsync<B, C>,
    op4: OperatorFunctionAsync<C, D>,
    op5: OperatorFunctionAsync<D, E>,
    op6: OperatorFunctionAsync<E, F>,
    op7: OperatorFunctionAsync<F, G>,
): Promise<G>
export function asyncPipe<T, A, B, C, D, E, F, G, H>(
    initial: T,
    op1: OperatorFunctionAsync<T, A>,
    op2: OperatorFunctionAsync<A, B>,
    op3: OperatorFunctionAsync<B, C>,
    op4: OperatorFunctionAsync<C, D>,
    op5: OperatorFunctionAsync<D, E>,
    op6: OperatorFunctionAsync<E, F>,
    op7: OperatorFunctionAsync<F, G>,
    op8: OperatorFunctionAsync<G, H>,
): Promise<H>
export function asyncPipe<T, A, B, C, D, E, F, G, H, I>(
    initial: T,
    op1: OperatorFunctionAsync<T, A>,
    op2: OperatorFunctionAsync<A, B>,
    op3: OperatorFunctionAsync<B, C>,
    op4: OperatorFunctionAsync<C, D>,
    op5: OperatorFunctionAsync<D, E>,
    op6: OperatorFunctionAsync<E, F>,
    op7: OperatorFunctionAsync<F, G>,
    op8: OperatorFunctionAsync<G, H>,
    op9: OperatorFunctionAsync<H, I>,
): Promise<I>
export function asyncPipe<T, A, B, C, D, E, F, G, H, I>(
    initial: T,
    op1: OperatorFunctionAsync<T, A>,
    op2: OperatorFunctionAsync<A, B>,
    op3: OperatorFunctionAsync<B, C>,
    op4: OperatorFunctionAsync<C, D>,
    op5: OperatorFunctionAsync<D, E>,
    op6: OperatorFunctionAsync<E, F>,
    op7: OperatorFunctionAsync<F, G>,
    op8: OperatorFunctionAsync<G, H>,
    op9: OperatorFunctionAsync<H, I>,
    ...operations: OperatorFunctionAsync<any, any>[]
): Promise<unknown>
export async function asyncPipe(
    initial: any,
    ...fns: ((...args: any[]) => Promise<any>)[]
) {
    if (fns.length !== 0)
        for (const func of fns) {
            initial = await func(initial)
        }
    return initial
}

export const pipeObj = <A, B>(fn: (a: A) => B) => {
    return {
        f: function <C>(g: (x: B) => C) {
            return pipeObj((arg: A) => g(fn(arg)))
        },
        build: () => fn,
    }
}
