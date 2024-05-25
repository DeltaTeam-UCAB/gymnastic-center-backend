import { Result } from "../../../../../src/core/application/result-handler/result.handler"
import { CreatePostCommand } from "../../../../../src/post/application/commands/create/create.post.command"
import { CreatePostResponse } from '../../../../../src/post/application/commands/create/types/response'
import { IdGeneratorMock } from "./utils/id.generator.mock"
import { createPost } from "./utils/post.factory"
import { PostRepositoryMock } from './utils/post.repository.mock'
import { EXIST_POST } from '../../../../../src/post/application/errors/exist.post'
import { DateProviderMock } from '../../course/tests/utils/date.provider.mock'
import { CreatePostDTO } from '../../../../../src/post/application/commands/create/types/dto'

export const name = 'Should not create post if title exist'
const date = new DateProviderMock(new Date())
export const body = async () => {
    const postBaseData = {
        title: 'test post',
        body: 'test made for post body',
        images: ['url-imagen1', 'url-imagen2'],
        tags: ['tag1', 'tag2'],
        category: 'category',
        trainer: 'Trainer name',
        date: date.current,
    } satisfies CreatePostDTO
    const postRepository = new PostRepositoryMock([
        createPost({
            title: 'test post',
        }),
    ])
    const result: Result<CreatePostResponse> = await new CreatePostCommand(
        new IdGeneratorMock(),
        postRepository,
    ).execute(postBaseData)
    result.handleError((e) => {
        lookFor(e.name).equals(EXIST_POST)
    })
}