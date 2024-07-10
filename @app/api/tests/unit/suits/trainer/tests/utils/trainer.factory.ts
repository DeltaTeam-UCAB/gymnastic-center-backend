import { ClientID } from '../../../../../../src/trainer/domain/value-objects/client.id'
import { Trainer } from '../../../../../../src/trainer/domain/trainer'
import { TrainerID } from '../../../../../../src/trainer/domain/value-objects/trainer.id'
import { TrainerLocation } from '../../../../../../src/trainer/domain/value-objects/trainer.location'
import { TrainerName } from '../../../../../../src/trainer/domain/value-objects/trainer.name'
import { TrainerImage } from '../../../../../../src/trainer/domain/value-objects/trainer.image'

export const createTrainer = (data: {
    id?: string
    name?: string
    location?: string
    followers?: string[]
    image?: string
}): Trainer =>
    new Trainer(
        new TrainerID(data?.id ?? 'ad023025-3f09-47ab-a207-af753aeda8a0'),
        {
            name: new TrainerName(data?.name ?? 'test trainer'),
            location: new TrainerLocation(data?.location ?? 'test location'),
            image: new TrainerImage(
                data.image ?? 'cb10e704-dc7e-49bb-bd78-969a4e93e304',
            ),
            followers: data.followers
                ? data?.followers.map((f) => new ClientID(f))
                : [],
        },
    )
