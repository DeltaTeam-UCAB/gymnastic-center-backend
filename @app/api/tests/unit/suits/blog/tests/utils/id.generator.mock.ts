import { IDGenerator } from '../../../../../../src/core/application/ID/ID.generator'

export class IdGeneratorMock implements IDGenerator<string> {
    constructor(private id?: string) {}
    generate(): string {
        return this.id ?? '1234567890'
    }
}