import { Result } from 'src/core/application/result-handler/result.handler'
import { Trainer } from '../../domain/trainer'
import { Optional } from '@mono/types-utils'
import { TrainerID } from 'src/trainer/domain/value-objects/trainer.id'
import { TrainerName } from 'src/trainer/domain/value-objects/trainer.name'
import { ClientID } from 'src/trainer/domain/value-objects/client.id'

export interface TrainerRepository {
    save(trainer: Trainer): Promise<Result<Trainer>>
    getById(id: TrainerID): Promise<Optional<Trainer>>
    getAllFilteredByFollowed(
        perPage: number,
        page: number,
        clientId: ClientID,
    ): Promise<Trainer[]>
    getAll(perPage: number, page: number): Promise<Trainer[]>
    existByName(name: TrainerName): Promise<boolean>
    countFollowsByClient(client: ClientID): Promise<number>
    delete(trainer: Trainer): Promise<Result<Trainer>>
}
