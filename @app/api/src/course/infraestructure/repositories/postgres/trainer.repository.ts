import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Trainer } from 'src/course/application/models/trainer'
import { TrainerRepository } from 'src/course/application/repositories/trainer.repository'
import { Trainer as TrainerORM } from '../../models/postgres/trainer.entity'
import { Repository } from 'typeorm'

export class TrainerPostgresByCourseRepository implements TrainerRepository {
    constructor(
        @InjectRepository(TrainerORM)
        private trainerProvider: Repository<TrainerORM>,
    ) {}
    existById(id: string): Promise<boolean> {
        return this.trainerProvider.existsBy({
            id,
        })
    }

    async getById(id: string): Promise<Optional<Trainer>> {
        const trainer = await this.trainerProvider.findOneBy({
            id,
        })
        if (!trainer) return null
        return {
            id: trainer.id,
            name: trainer.name,
        }
    }
}
