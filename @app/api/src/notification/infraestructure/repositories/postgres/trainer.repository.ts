import { Trainer } from 'src/notification/application/models/trainer'
import { TrainerRepository } from 'src/notification/application/repositories/trainer.repository'
import { Follow } from '../../models/postgres/follow.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Trainer as TrainerORM } from '../../models/postgres/trainer.entity'
import { Optional } from '@mono/types-utils'
import { isNotNull } from 'src/utils/null-manager/null-checker'

export class TrainerPostgresByNotificationRepository
implements TrainerRepository
{
    constructor(
        @InjectRepository(TrainerORM)
        private trainerRepository: Repository<TrainerORM>,
        @InjectRepository(Follow)
        private followRepository: Repository<Follow>,
    ) {}

    async getById(id: string): Promise<Optional<Trainer>> {
        const trainer = await this.trainerRepository.findOneBy({
            id: id,
        })
        if (!isNotNull(trainer)) {
            return null
        }
        const follows = await this.followRepository.find({
            where: {
                trainerId: id,
            },
            select: {
                userId: true,
            },
        })
        return {
            id: trainer.id,
            name: trainer.name,
            followers: follows.map((e) => e.userId),
        }
    }
}
