export type UnwrapInput<T> = T extends any[] ? T : T[]

export interface ControllerContract<T, U> {
    execute(...args: UnwrapInput<T>): Promise<U>
}
