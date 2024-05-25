import { CreatePostCommand } from '../../../../../src/post/application/commands/create/create.post.command'
import { IdGeneratorMock } from './utils/id.generator.mock'
import { PostRepositoryMock } from './utils/post.repository.mock'
import { DateProviderMock } from '../../course/tests/utils/date.provider.mock'
import { CreatePostDTO } from '../../../../../src/post/application/commands/create/types/dto'


export const name = 'Should create post whit valid data'
export const body = async () => {
    const postId = '1234567890'
    const date = new DateProviderMock(new Date())
    const postBaseData = {
        title: 'test post',
        body: 'test made for post body',
        images: ['url-imagen1', 'url-imagen2'],
        tags: ['tag1', 'tag2'],
        category: 'category',
        trainer: 'Trainer name',
        date: date.current,
    } satisfies CreatePostDTO
    const postRepository = new PostRepositoryMock()
    await new CreatePostCommand(new IdGeneratorMock(), postRepository).execute(postBaseData)
    lookFor(await postRepository.existByTitle('test post')).toDeepEqual({
        id: postId,
        title: 'test post',
        body: 'test made for post body',
        images: ['url-imagen1', 'url-imagen2'],
        tags: ['tag1', 'tag2'],
        category: 'category',
        trainer: 'Trainer name',
        date: date.current,
    })
}