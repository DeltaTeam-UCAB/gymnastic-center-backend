import { Result } from 'src/core/application/result-handler/result.handler'
import { Trainer } from '../models/trainer'
import { Optional } from '@mono/types-utils'

export interface TrainerRepository {
    save(trainer: Trainer): Promise<Result<Trainer>>
    getById(id: string): Promise<Optional<Trainer>>
    followTrainer(userId: string, trainerId: string): Promise<Result<boolean>>
    unfollowTrainer(userId: string, trainerId: string): Promise<Result<boolean>>
}
