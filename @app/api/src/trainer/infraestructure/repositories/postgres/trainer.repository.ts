import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Trainer } from 'src/trainer/application/models/trainer'
import { TrainerRepository } from 'src/trainer/application/repositories/trainer.repository'
import { Trainer as TrainerORM } from '../../models/postgres/trainer.entity'
import { Repository } from 'typeorm'

export class TrainerPostgresRepository implements TrainerRepository {
    constructor(
        @InjectRepository(TrainerORM)
        private trainerRepository: Repository<TrainerORM>,
    ) {}

    async save(trainer: Trainer): Promise<Result<Trainer>> {
        await this.trainerRepository.upsert(
            this.trainerRepository.create(trainer),
            ['id'],
        )
        return Result.success(trainer)
    }

    async getById(id: string): Promise<Optional<Trainer>> {
        const trainer = await this.trainerRepository.findOneBy({
            id,
        })
        return trainer
    }
}
