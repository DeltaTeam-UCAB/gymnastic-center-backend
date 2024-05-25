import { ApplicationService } from 'src/core/application/service/application.service'
import { CreatePostDTO } from './types/dto'
import { CreatePostResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { PostRepository } from '../../repositories/post.repository'
import { existPost } from '../../errors/exist.post'
import { Posts } from '../../models/posts'

export class CreatePostCommand
implements ApplicationService<CreatePostDTO, CreatePostResponse>
{
    constructor(
        private idGenerator: IDGenerator<string>,
        private postRepository: PostRepository,
    ) {}
    async execute(data: CreatePostDTO): Promise<Result<CreatePostResponse>> {
        const isTitleExist = await this.postRepository.existByTitle(data.title)
        if (isTitleExist) return Result.error(existPost())
        const postId = this.idGenerator.generate()
        const post = {
            ...data,
            id: postId,
            date: new Date(),
        } satisfies Posts

        const result = await this.postRepository.save(post)
        if (result.isError()) return result.convertToOther()
        return Result.success({
            id: postId,
        })
    }
}
