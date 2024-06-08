import { ValueObject } from 'src/core/domain/value-objects/value.object'

export class LessonImage implements ValueObject<LessonImage> {
    constructor(private _image: string) {}
    get image() {
        return this._image
    }
    equals(other?: LessonImage | undefined): boolean {
        return other?.image === this.image
    }
}
