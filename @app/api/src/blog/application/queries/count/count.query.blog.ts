import { ApplicationService } from 'src/core/application/service/application.service'
import { CountBlogsDTO } from './types/dto'
import { CountBlogsResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { BlogRepository } from '../../repositories/blog.repository'
import { TrainerId } from 'src/blog/domain/value-objects/trainer.id'
import { CategoryId } from 'src/blog/domain/value-objects/category.id'

export class CountBlogsQuery
    implements ApplicationService<CountBlogsDTO, CountBlogsResponse>
{
    constructor(private blogRepository: BlogRepository) {}

    async execute(data: CountBlogsDTO): Promise<Result<CountBlogsResponse>> {
        let count: number = 0

        if (data.category)
            count = await this.blogRepository.countByCategory(
                new CategoryId(data.category),
            )
        else if (data.trainer)
            count = await this.blogRepository.countByTrainer(
                new TrainerId(data.trainer),
            )

        return Result.success({
            count,
        })
    }
}
