import { ApplicationService } from 'src/core/application/service/application.service'
import { CountByTrainerBlogDTO } from './types/dto'
import { CountByTrainerBlogResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { BlogRepository } from '../../repositories/blog.repository'
import { TrainerId } from 'src/blog/domain/value-objects/trainer.id'

export class CountByTrainerBlogQuery
    implements
        ApplicationService<CountByTrainerBlogDTO, CountByTrainerBlogResponse>
{
    constructor(private blogRepository: BlogRepository) {}

    async execute(
        data: CountByTrainerBlogDTO,
    ): Promise<Result<CountByTrainerBlogResponse>> {
        return Result.success({
            blogs: await this.blogRepository.countByTrainer(
                new TrainerId(data.trainer),
            ),
        })
    }
}
