import { AggregateRoot } from 'src/core/domain/aggregates/aggregate.root'
import { TrainerID } from './value-objects/trainer.id'
import { TrainerName } from './value-objects/trainer.name'
import { TrainerLocation } from './value-objects/trainer.location'
import { ClientID } from './value-objects/client.id'
import { unvalidTrainer } from './exceptions/unvalid.trainer'
import { trainerCreated } from './events/trainer.created'
import { trainerLocationChanged } from './events/trainer.location.changed'
import { followerAdded } from './events/follower.added'
import { followerRemoved } from './events/follower.removed'
import { trainerNameChanged } from './events/trainer.name.changed'
import { trainerDeleted } from './events/trainer.deleted'
import { TrainerImage } from './value-objects/trainer.image'

export class Trainer extends AggregateRoot<TrainerID> {
    constructor(
        id: TrainerID,
        private data: {
            name: TrainerName
            location: TrainerLocation
            image: TrainerImage
            followers?: ClientID[]
        },
    ) {
        if (!data.followers) data.followers = []
        super(id)
        this.publish(
            trainerCreated({
                id,
                location: data.location,
                _name: data.name,
                image: data.image,
                followers: data.followers!,
            }),
        )
    }

    get name() {
        return this.data.name
    }

    get location() {
        return this.data.location
    }

    get followers() {
        return [...this.data.followers!]
    }

    get image() {
        return this.data.image
    }

    isFollowedBy(follower: ClientID) {
        return this.followers.some((e) => e == follower)
    }

    changeName(name: TrainerName) {
        this.data.name = name
        this.publish(
            trainerNameChanged({
                id: this.id,
                _name: name,
            }),
        )
    }

    changeLocation(location: TrainerLocation) {
        this.data.location = location
        this.publish(
            trainerLocationChanged({
                id: this.id,
                location,
            }),
        )
    }

    addFollower(follower: ClientID) {
        if (this.followers.some((e) => e == follower)) return
        this.data.followers?.push(follower)
        this.publish(
            followerAdded({
                id: this.id,
                follower,
            }),
        )
    }

    removeFollower(follower: ClientID) {
        this.data.followers = this.data.followers?.filter((e) => e != follower)
        this.publish(
            followerRemoved({
                id: this.id,
                follower,
            }),
        )
    }

    delete() {
        this.publish(
            trainerDeleted({
                id: this.id,
            }),
        )
    }

    validateState(): void {
        if (!this.id || !this.name || !this.location || !this.followers)
            throw unvalidTrainer()
    }
}
