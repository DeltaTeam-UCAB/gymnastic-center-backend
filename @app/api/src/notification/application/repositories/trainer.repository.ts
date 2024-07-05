import { Optional } from '@mono/types-utils'
import { Trainer } from '../models/trainer'

export interface TrainerRepository {
    getById(id: string): Promise<Optional<Trainer>>
}
