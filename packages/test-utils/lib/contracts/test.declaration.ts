export type SuitOptions = {
    skip?: boolean
    only?: boolean
}

export type SuitDeclaration = (
    name: string,
    data?: {
        tests?: TestDeclaration[]
        options?: SuitOptions
        beforeEach?: (() => void | Promise<void>)[]
        beforeAll?: (() => void | Promise<void>)[]
        afterAll?: (() => void | Promise<void>)[]
        afterEach?: (() => void | Promise<void>)[]
    },
) => void

export type TestOptions = {
    skip?: boolean
    only?: boolean
}

export type TestDeclaration = {
    name: string
    body(): void | Promise<void>
    options?: TestOptions
}
