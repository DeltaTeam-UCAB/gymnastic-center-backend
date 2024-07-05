import { ApplicationService } from 'src/core/application/service/application.service'
import { RecomendTrainerBlogPolicyDTO } from './types/dto'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CreateNotificationDTO } from '../../commands/create/types/dto'
import { CreateNotificationResponse } from '../../commands/create/types/response'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { trainerNotFoundError } from '../../errors/trainer.not.found'
import { BlogRepository } from '../../repositories/blog.repository'
import { blogNotFoundError } from '../../errors/blog.not.found'

export class TrainerBlogRecomendationPolicy
    implements ApplicationService<RecomendTrainerBlogPolicyDTO, void>
{
    constructor(
        private notificationService: ApplicationService<
            CreateNotificationDTO,
            CreateNotificationResponse
        >,
        private blogRepository: BlogRepository,
        private trainerRepository: TrainerRepository,
    ) {}
    async execute(data: RecomendTrainerBlogPolicyDTO): Promise<Result<void>> {
        const blog = await this.blogRepository.getById(data.blogId)
        if (!blog) return Result.error(blogNotFoundError())
        const trainer = await this.trainerRepository.getById(data.trainerId)
        if (!trainer) return Result.error(trainerNotFoundError())
        const results = await trainer.followers.asyncMap((s) =>
            this.notificationService.execute({
                client: s,
                title: `News for ${trainer.name}`,
                body: `We have updates : ${trainer.name} has news in the blog ${blog.title}`,
            }),
        )
        const error = results.find((e) => e.isError())
        if (error) return error.convertToOther()
        return Result.success(undefined)
    }
}
