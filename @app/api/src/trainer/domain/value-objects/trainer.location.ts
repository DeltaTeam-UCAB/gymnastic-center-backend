import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidTrainerLocation } from '../exceptions/unvalid.trainer.location'

export class TrainerLocation implements ValueObject<TrainerLocation> {
    constructor(private _location: string) {
        if (_location.length < 4) throw unvalidTrainerLocation()
    }

    get location() {
        return this._location
    }

    equals(other?: TrainerLocation | undefined): boolean {
        return other?.location === this.location
    }
}
