import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { TrainerRepository } from 'src/course/application/repositories/trainer.repository'
import { Trainer as TrainerORM } from '../../models/postgres/trainer.entity'
import { Repository } from 'typeorm'
import { Trainer } from 'src/course/domain/entities/trainer'
import { TrainerID } from 'src/course/domain/value-objects/trainer.id'
import { TrainerName } from 'src/course/domain/value-objects/trainer.name'

export class TrainerPostgresByCourseRepository implements TrainerRepository {
    constructor(
        @InjectRepository(TrainerORM)
        private trainerProvider: Repository<TrainerORM>,
    ) {}
    existById(id: TrainerID): Promise<boolean> {
        return this.trainerProvider.existsBy({
            id: id.id,
            active: true,
        })
    }

    async getById(id: TrainerID): Promise<Optional<Trainer>> {
        const trainer = await this.trainerProvider.findOneBy({
            id: id.id,
            active: true,
        })
        if (!trainer) return null
        return new Trainer(id, {
            name: new TrainerName(trainer.name),
        })
    }
}
