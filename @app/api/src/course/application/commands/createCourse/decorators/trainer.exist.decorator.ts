import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateCourseDTO } from '../types/dto'
import { CreateCourseResponse } from '../types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { TrainerRepository } from 'src/course/application/repositories/trainer.repository'
import { trainerNotExistError } from 'src/course/application/errors/trainer.not.exist'

export class TrainerExistDecorator
implements ApplicationService<CreateCourseDTO, CreateCourseResponse>
{
    constructor(
        private service: ApplicationService<
            CreateCourseDTO,
            CreateCourseResponse
        >,
        private trainerRepository: TrainerRepository,
    ) {}
    async execute(
        data: CreateCourseDTO,
    ): Promise<Result<CreateCourseResponse>> {
        const trainerExist = await this.trainerRepository.existById(
            data.trainer,
        )
        if (!trainerExist) return Result.error(trainerNotExistError())
        return this.service.execute(data)
    }
}
