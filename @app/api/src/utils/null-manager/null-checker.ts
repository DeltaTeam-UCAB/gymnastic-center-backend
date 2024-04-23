export const isNotNull = <T>(value: T | undefined | null): value is T =>
    value != null
