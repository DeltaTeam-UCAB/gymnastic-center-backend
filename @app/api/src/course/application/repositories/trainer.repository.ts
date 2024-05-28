import { Optional } from '@mono/types-utils'
import { Trainer } from '../models/trainer'

export interface TrainerRepository {
    existById(id: string): Promise<boolean>
    getById(id: string): Promise<Optional<Trainer>>
}
