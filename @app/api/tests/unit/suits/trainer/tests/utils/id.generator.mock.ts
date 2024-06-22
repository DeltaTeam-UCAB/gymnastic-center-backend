import { IDGenerator } from '../../../../../../src/core/application/ID/ID.generator'

export class IDGeneratorMock implements IDGenerator<string> {
    constructor(private id?: string) {}
    generate(): string {
        return this.id ?? '10d42d92-55d0-4eba-ad67-a4afd33c8cd7'
    }
}
