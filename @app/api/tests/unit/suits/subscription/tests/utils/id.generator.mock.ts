import { IDGenerator } from '../../../../../../src/core/application/ID/ID.generator'

export class IDGeneratorMock implements IDGenerator<string> {
    constructor(private id?: string) {}
    generate(): string {
        return this.id ?? '639a2d0d-0485-4f5b-900a-0a656c4993af'
    }
}
