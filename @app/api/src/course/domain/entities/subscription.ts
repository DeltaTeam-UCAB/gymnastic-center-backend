import { Entity } from 'src/core/domain/entity/entity'
import { SubscriptionID } from '../value-objects/subscription.id'
import { SubscriptionProgress } from '../value-objects/subscription.progress'
import { ClientID } from '../value-objects/client.id'
import { CourseID } from '../value-objects/course.id'

export class Subscription extends Entity<SubscriptionID> {
    constructor(
        id: SubscriptionID,
        private data: {
            progress: SubscriptionProgress
            client: ClientID
            course: CourseID
        },
    ) {
        super(id)
    }

    get progress() {
        return this.data.progress
    }

    get client() {
        return this.data.client
    }

    get course() {
        return this.data.course
    }

    changeProgress(progress: SubscriptionProgress) {
        this.data.progress = progress
    }
}
