import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidSubscriptionProgress } from '../exceptions/unvalid.subscription.progress'

export class SubscriptionProgress implements ValueObject<SubscriptionProgress> {
    constructor(private _progress: number) {
        if (_progress < 0 || _progress > 100)
            throw unvalidSubscriptionProgress()
    }

    get progress() {
        return this._progress
    }

    equals(other?: SubscriptionProgress | undefined): boolean {
        return other?.progress === this.progress
    }
}
