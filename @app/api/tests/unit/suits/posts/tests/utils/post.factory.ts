import { Posts } from '../../../../../../src/post/application/models/posts'
import { DateProviderMock } from '../../../course/tests/utils/date.provider.mock'

const date = new DateProviderMock(new Date())
export const createPost = (data?: {
    id?: string
    title?: string
    body?: string
    images?: string[]
    tags?: string[]
    category?: string
    trainer?: string
    date?: Date
}): Posts => ({
    id: data?.id ?? '1234567890',
    title: data?.title ?? 'test post',
    body: data?.body ?? 'test made for post body',
    images: data?.images ?? ['url-imagen1', 'url-imagen2'],
    tags: data?.tags ?? ['tag1', 'tag2'],
    category: data?.category ?? 'category',
    trainer: data?.trainer ?? 'Trainer name',
    date: data?.date ?? date.current,
})