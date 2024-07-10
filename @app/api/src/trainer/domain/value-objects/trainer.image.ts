import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidTrainerImage } from '../exceptions/unvalid.trainer.image'

export class TrainerImage implements ValueObject<TrainerImage> {
    constructor(private _image: string) {
        if (!regExpUUID.test(_image)) throw unvalidTrainerImage()
    }
    get image() {
        return this._image
    }
    equals(other?: TrainerImage | undefined): boolean {
        return other?.image === this.image
    }
}
