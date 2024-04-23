import { ValueObject } from 'src/core/domain/value-objects/value.object'

export class FieldName implements ValueObject<FieldName> {
    constructor(
        private field: string,
        verifiers: ((field: string) => boolean)[] = [],
    ) {
        if (!field || verifiers.find((e) => !e(field)))
            throw new Error('Not Field provide')
    }

    get value() {
        return this.field
    }

    equals(other: FieldName): boolean {
        return other.value === this.value
    }
}
