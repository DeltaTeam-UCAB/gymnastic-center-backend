import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidTrainerId } from '../exceptions/unvalid.trainer.id'

export class TrainerId implements ValueObject<TrainerId> {
    constructor(private _id: string) {
        if (!regExpUUID.test(_id)) throw unvalidTrainerId()
    }
    get id() {
        return this._id
    }
    equals(other?: TrainerId | undefined): boolean {
        return other?.id === this.id
    }
}
