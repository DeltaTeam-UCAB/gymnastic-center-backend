export type EmitEventHandler<T> = (
    data: T,
    event: string,
    ...to: string[]
) => void
