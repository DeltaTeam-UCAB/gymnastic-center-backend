import { ApplicationService } from 'src/core/application/service/application.service'
import { GetVideoByIdDTO } from './types/dto'
import { GetVideoByIdResponse } from './types/response'
import { VideoRepository } from '../../repositories/video.repository'
import { Result } from 'src/core/application/result-handler/result.handler'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { videoNotFoundError } from '../../error/video.not.found'

export class GetVideoByIdQuery
implements ApplicationService<GetVideoByIdDTO, GetVideoByIdResponse>
{
    constructor(private videoRepository: VideoRepository) {}

    async execute(
        data: GetVideoByIdDTO,
    ): Promise<Result<GetVideoByIdResponse>> {
        const video = await this.videoRepository.getById(data.id)
        if (!isNotNull(video)) return Result.error(videoNotFoundError())
        return Result.success(video)
    }
}
