import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Trainer } from 'src/blog/application/models/trainer'
import { TrainerRepository } from 'src/blog/application/repositories/trainer.repository'
import { Trainer as TrainerORM } from '../../models/postgres/trainer.entity'
import { Repository } from 'typeorm'

export class TrainerByBlogPostgresRepository implements TrainerRepository {
    constructor(
        @InjectRepository(TrainerORM)
        private trainerProvider: Repository<TrainerORM>,
    ) {}
    existsById(id: string): Promise<boolean> {
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
