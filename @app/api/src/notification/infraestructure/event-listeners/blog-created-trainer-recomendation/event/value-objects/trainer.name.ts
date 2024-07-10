import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidTrainerName } from '../exceptions/unvalid.trainer.name'

export class TrainerName implements ValueObject<TrainerName> {
    constructor(private _name: string) {
        if (_name.length < 4) throw unvalidTrainerName()
    }
    get name() {
        return this._name
    }
    equals(other?: TrainerName | undefined): boolean {
        return other?.name === this.name
    }
}
