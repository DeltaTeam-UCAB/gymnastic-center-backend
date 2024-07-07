import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Trainer } from 'src/trainer/domain/trainer'
import { TrainerRepository } from 'src/trainer/application/repositories/trainer.repository'
import { Trainer as TrainerORM } from '../../models/postgres/trainer.entity'
import { Repository } from 'typeorm'
import { Follow } from '../../models/postgres/follow.entity'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { ClientID } from 'src/trainer/domain/value-objects/client.id'
import { TrainerID } from 'src/trainer/domain/value-objects/trainer.id'
import { TrainerName } from 'src/trainer/domain/value-objects/trainer.name'
import { TrainerLocation } from 'src/trainer/domain/value-objects/trainer.location'
import { TrainerImage } from 'src/trainer/domain/value-objects/trainer.image'

export class TrainerPostgresRepository implements TrainerRepository {
    constructor(
        @InjectRepository(TrainerORM)
        private trainerRepository: Repository<TrainerORM>,
        @InjectRepository(Follow)
        private followRepository: Repository<Follow>,
    ) {}

    async save(trainer: Trainer): Promise<Result<Trainer>> {
        await this.trainerRepository.upsert(
            this.trainerRepository.create({
                id: trainer.id.id,
                name: trainer.name.name,
                location: trainer.location.location,
                image: trainer.image.image,
            }),
            ['id'],
        )
        await this.followRepository.delete({
            trainerId: trainer.id.id,
        })
        trainer.followers.asyncForEach(async (f) => {
            await this.followRepository.save({
                userId: f.id,
                trainerId: trainer.id.id,
            })
        })
        return Result.success(trainer)
    }

    async getById(id: TrainerID): Promise<Optional<Trainer>> {
        const trainer = await this.trainerRepository.findOneBy({
            id: id.id,
            active: true,
        })
        if (!isNotNull(trainer)) {
            return null
        }
        const follows = await this.followRepository.find({
            where: {
                trainerId: id.id,
            },
            select: {
                userId: true,
            },
        })
        const followers = follows.map((f) => new ClientID(f.userId))
        return new Trainer(new TrainerID(trainer.id), {
            name: new TrainerName(trainer.name),
            location: new TrainerLocation(trainer.location),
            followers,
            image: new TrainerImage(trainer.image),
        })
    }

    async getAll(perPage: number, page: number): Promise<Trainer[]> {
        const trainersORM = await this.trainerRepository.find({
            take: perPage,
            skip: perPage * (page - 1),
            where: {
                active: true,
            },
        })
        const trainers = trainersORM.asyncMap(
            async (t) =>
                new Trainer(new TrainerID(t.id), {
                    name: new TrainerName(t.name),
                    location: new TrainerLocation(t.location),
                    image: new TrainerImage(t.image),
                    followers: await this.followRepository
                        .find({
                            where: {
                                trainerId: t.id,
                            },
                            select: {
                                userId: true,
                            },
                        })
                        .map((f) => new ClientID(f.userId)),
                }),
        )
        return trainers
    }

    async getAllFilteredByFollowed(
        perPage: number,
        page: number,
        clientId: ClientID,
    ): Promise<Trainer[]> {
        const trainersFollowed = await this.followRepository.find({
            where: {
                userId: clientId.id,
            },
            select: {
                trainerId: true,
            },
        })
        const trainersORM = await trainersFollowed.asyncMap(
            async (t) =>
                this.trainerRepository.findOneBy({
                    id: t.trainerId,
                }) as unknown as TrainerORM,
        )
        const trainersORMFiltered = (
            await trainersORM.asyncFilter(async (t) =>
                this.trainerRepository.existsBy({
                    id: t.id,
                    active: true,
                }),
            )
        ).slice(perPage * (page - 1), perPage * (page - 1) + perPage)
        const trainers = trainersORMFiltered.asyncMap(
            async (t) =>
                new Trainer(new TrainerID(t.id), {
                    name: new TrainerName(t.name),
                    location: new TrainerLocation(t.location),
                    image: new TrainerImage(t.image),
                    followers: await this.followRepository
                        .find({
                            where: {
                                trainerId: t.id,
                            },
                            select: {
                                userId: true,
                            },
                        })
                        .map((f) => new ClientID(f.userId)),
                }),
        )
        return trainers
    }

    async existByName(name: TrainerName): Promise<boolean> {
        const exists = await this.trainerRepository.existsBy({
            name: name.name,
            active: true,
        })
        return exists
    }

    async countFollowsByClient(client: ClientID): Promise<number> {
        const trainersFollowed = await this.followRepository.find({
            where: {
                userId: client.id,
            },
        })
        const trainersFollowedFiltered = await trainersFollowed.asyncFilter(
            async (t) =>
                this.trainerRepository.existsBy({
                    id: t.trainerId,
                    active: true,
                }),
        )
        return trainersFollowedFiltered.length
    }

    async delete(trainer: Trainer): Promise<Result<Trainer>> {
        const trainerORM = await this.trainerRepository.findOneByOrFail({
            id: trainer.id.id,
        })
        trainerORM.active = false
        await this.trainerRepository.save(trainerORM)
        return Result.success(trainer)
    }
}
