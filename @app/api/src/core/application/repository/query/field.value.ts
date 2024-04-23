import { ValueObject } from 'src/core/domain/value-objects/value.object'

export class FieldValue implements ValueObject<FieldValue> {
    constructor(
        private data: string | number | boolean,
        verifiers: ((data: string | number | boolean) => boolean)[] = [],
    ) {
        if (
            data === undefined ||
            data === null ||
            verifiers.find((e) => !e(data))
        )
            throw new Error('Invalid data')
    }

    get value() {
        return this.data
    }

    equals(other: FieldValue): boolean {
        return other.value === this.value
    }
}
