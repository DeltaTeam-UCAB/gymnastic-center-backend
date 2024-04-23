export interface ApplicationErrorRecord {}

export type ApplicationError<T = any> = {
    name: string
    message: string
    kind: 'APPLICATION'
    info: T
}

export const makeApplicationErrorFactory = <T = void>(data: {
    name: string
    message: string
}) => {
    const target = class extends Error implements ApplicationError<T> {
        name = data.name
        message = data.message
        kind = 'APPLICATION' as const
        constructor(public info: T) {
            super()
            const arr = this.stack?.split('\n')
            arr?.splice(1, 1)
            this.stack = arr?.join('\n')
        }
    }
    return (info: T) => new target(info)
}
