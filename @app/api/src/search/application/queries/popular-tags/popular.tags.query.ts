import { ApplicationService } from 'src/core/application/service/application.service'
import { GetPopularTagsDTO } from './types/dto'
import { GetPopularTagsResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { TagProvider } from '../../services/tag.provider'

export class GetPopularTagsQuery
    implements ApplicationService<GetPopularTagsDTO, GetPopularTagsResponse>
{
    constructor(private tagProvider: TagProvider) {}
    async execute(
        data: GetPopularTagsDTO,
    ): Promise<Result<GetPopularTagsResponse>> {
        return Result.success(await this.tagProvider.getPopular(data))
    }
}
