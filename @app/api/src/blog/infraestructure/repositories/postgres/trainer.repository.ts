import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { TrainerRepository } from 'src/blog/application/repositories/trainer.repository'
import { Trainer as TrainerORM } from '../../models/postgres/trainer.entity'
import { Repository } from 'typeorm'
import { TrainerId } from 'src/blog/domain/value-objects/trainer.id'
import { Trainer } from 'src/blog/domain/entities/trainer'
import { TrainerName } from '../../../domain/value-objects/trainer.name'

export class TrainerByBlogPostgresRepository implements TrainerRepository {
    constructor(
        @InjectRepository(TrainerORM)
        private trainerProvider: Repository<TrainerORM>,
    ) {}

    existsById(id: TrainerId): Promise<boolean> {
        return this.trainerProvider.existsBy({
            id: id.id,
        })
    }

    async getById(id: TrainerId): Promise<Optional<Trainer>> {
        const trainer = await this.trainerProvider.findOneBy({
            id: id.id,
        })
        if (!trainer) return null
        return new Trainer(new TrainerId(trainer.id), {
            name: new TrainerName(trainer.name),
        })
    }
}
