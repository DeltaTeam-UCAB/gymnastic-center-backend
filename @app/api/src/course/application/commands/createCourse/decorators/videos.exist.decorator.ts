import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateCourseDTO } from '../types/dto'
import { CreateCourseResponse } from '../types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { VideoRepository } from 'src/course/application/repositories/video.repository'
import { videoNotExistError } from 'src/course/application/errors/video.not.exist'

export class VideosExistDecorator
implements ApplicationService<CreateCourseDTO, CreateCourseResponse>
{
    constructor(
        private service: ApplicationService<
            CreateCourseDTO,
            CreateCourseResponse
        >,
        private videoRepository: VideoRepository,
    ) {}
    async execute(
        data: CreateCourseDTO,
    ): Promise<Result<CreateCourseResponse>> {
        const videosExist = await data.lessons
            .filter((e) => e.video)
            .asyncMap((e) => this.videoRepository.existById(e.video!))
        if (videosExist.some((e) => !e))
            return Result.error(videoNotExistError())
        return this.service.execute(data)
    }
}
