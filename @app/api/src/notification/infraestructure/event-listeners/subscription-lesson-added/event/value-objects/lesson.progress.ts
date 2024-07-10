import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidProgress } from '../exceptions/unvalid.progress'

export class LessonProgress implements ValueObject<LessonProgress> {
    constructor(private _percent: number) {
        if (_percent.nextInt() !== _percent || _percent > 100 || _percent < 0)
            throw unvalidProgress()
    }

    get percent() {
        return this._percent
    }

    lessThan(other?: LessonProgress) {
        return this.percent < (other?.percent ?? 0)
    }

    equals(other?: LessonProgress | undefined): boolean {
        return other?.percent === this.percent
    }

    static createEmpty() {
        return new LessonProgress(0)
    }

    static createFull() {
        return new LessonProgress(100)
    }
}
