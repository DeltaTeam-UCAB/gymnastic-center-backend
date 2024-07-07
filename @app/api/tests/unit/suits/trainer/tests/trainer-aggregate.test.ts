import { Trainer } from '../../../../../src/trainer/domain/trainer'
import { ClientID } from '../../../../../src/trainer/domain/value-objects/client.id'
import { TrainerID } from '../../../../../src/trainer/domain/value-objects/trainer.id'
import { TrainerImage } from '../../../../../src/trainer/domain/value-objects/trainer.image'
import { TrainerLocation } from '../../../../../src/trainer/domain/value-objects/trainer.location'
import { TrainerName } from '../../../../../src/trainer/domain/value-objects/trainer.name'

export const name = 'Should create a trainer aggregate'
export const body = () => {
    const trainer = new Trainer(
        new TrainerID('b975b949-c909-4bfa-812b-2578c6461b58'),
        {
            name: new TrainerName('test trainer'),
            location: new TrainerLocation('test location'),
            followers: [new ClientID('4aa6e173-c083-4731-b049-33053490030e')],
            image: new TrainerImage('cb10e704-dc7e-49bb-bd78-969a4e93e304'),
        },
    )
    lookFor(trainer).toBeDefined()
}
