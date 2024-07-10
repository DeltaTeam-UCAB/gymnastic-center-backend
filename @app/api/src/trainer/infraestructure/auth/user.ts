export const userTypes = ['ADMIN', 'CLIENT'] as const

export type UserType = (typeof userTypes)[number]

export type User = {
    id: string
    name: string
    password: string
    email: string
    type: UserType
}
