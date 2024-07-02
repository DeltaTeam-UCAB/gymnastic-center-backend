import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateBlogDTO } from '../types/dto'
import { CreateBlogResponse } from '../types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { TrainerRepository } from 'src/blog/application/repositories/trainer.repository'
import { trainerNotFoundError } from 'src/trainer/application/errors/trainer.not.found'
import { TrainerId } from '../../../../domain/value-objects/trainer.id'

export class TrainerExistDecorator
    implements ApplicationService<CreateBlogDTO, CreateBlogResponse>
{
    constructor(
        private service: ApplicationService<CreateBlogDTO, CreateBlogResponse>,
        private trainerRepository: TrainerRepository,
    ) {}
    async execute(data: CreateBlogDTO): Promise<Result<CreateBlogResponse>> {
        const trainerExist = await this.trainerRepository.existsById(
            new TrainerId(data.trainer),
        )
        if (!trainerExist) return Result.error(trainerNotFoundError())
        return this.service.execute(data)
    }
}
