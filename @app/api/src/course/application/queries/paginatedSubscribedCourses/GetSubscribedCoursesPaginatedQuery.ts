import { ApplicationService } from 'src/core/application/service/application.service'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CourseRepository } from '../../repositories/course.repository'
import { ImageRepository } from '../../repositories/image.repository'
import { SubscriptionRepository } from '../../repositories/subscription.repository'
import { GetSubscribedCoursesDTO } from './types/dto'
import { GetSubscribedCoursesResponse } from './types/response'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { ClientID } from 'src/course/domain/value-objects/client.id'

export class GetSubscribedCoursesPaginatedQuery
    implements
        ApplicationService<
            GetSubscribedCoursesDTO,
            GetSubscribedCoursesResponse
        >
{
    constructor(
        private courseRepo: CourseRepository,
        private imageRepository: ImageRepository,
        private suscriptionRepo: SubscriptionRepository,
    ) {}
    async execute(
        data: GetSubscribedCoursesDTO,
    ): Promise<Result<GetSubscribedCoursesResponse>> {
        const subscriptions = await this.suscriptionRepo.getManyByClientID({
            client: new ClientID(data.client),
            page: data.page,
            perPage: data.perPage,
        })
        const courses = await subscriptions
            .asyncMap((subscription) =>
                this.courseRepo.getById(subscription.course),
            )
            .filter((e) => isNotNull(e))

        return Result.success(
            await courses.asyncMap(async (course) => ({
                id: course!.id.id,
                title: course!.title.title,
                description: course!.description.description,
                date: course!.creationDate.date,
                category: course!.category.name.name,
                trainer: course!.trainer.name.name,
                image: (await this.imageRepository.getById(course!.image))!.src,
                progress: subscriptions.find((e) => e.course == course!.id)!
                    .progress.progress,
            })),
        )
    }
}
