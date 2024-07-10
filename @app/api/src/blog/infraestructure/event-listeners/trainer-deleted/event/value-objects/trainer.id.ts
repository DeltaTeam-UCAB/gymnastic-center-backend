import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidTrainerId } from '../exceptions/unvalid.trainer.id'

export class TrainerID implements ValueObject<TrainerID> {
    constructor(private _id: string) {
        if (!regExpUUID.test(_id)) throw unvalidTrainerId()
    }
    get id() {
        return this._id
    }
    equals(other?: TrainerID | undefined): boolean {
        return other?.id === this.id
    }
}
