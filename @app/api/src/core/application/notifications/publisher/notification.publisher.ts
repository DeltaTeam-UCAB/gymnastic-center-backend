export type Publisher<T extends object> = (data: T) => void | Promise<void>
