export interface DomainErrorRecord {}

export type DomainError<T = void> = {
    name: string
    message: string
    kind: 'DOMAIN'
    info: T
}

export const makeDomainErrorFactory = <T = void>(data: {
    name: string
    message: string
}) => {
    const target = class extends Error implements DomainError<T> {
        name = data.name
        message = data.message
        kind = 'DOMAIN' as const
        constructor(public info: T) {
            super()
            const arr = this.stack?.split('\n')
            arr?.splice(1, 1)
            this.stack = arr?.join('\n')
        }
    }
    return (info: T) => new target(info)
}
