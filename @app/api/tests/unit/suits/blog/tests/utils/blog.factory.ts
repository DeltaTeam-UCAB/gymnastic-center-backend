import { Blog } from '../../../../../../src/blog/application/models/blog'
import { DateProviderMock } from '../../../course/tests/utils/date.provider.mock'

const date = new DateProviderMock(new Date())
export const createBlog = (data?: {
    id?: string
    title?: string
    body?: string
    images?: string[]
    tags?: string[]
    category?: string
    trainer?: string
    date?: Date
}): Blog => ({
    id: data?.id ?? '1234567890',
    title: data?.title ?? 'test blog',
    body: data?.body ?? 'test made for blog body',
    images: data?.images ?? ['id-imagen1', 'id-imagen2'],
    tags: data?.tags ?? ['tag1', 'tag2'],
    category: data?.category ?? '123456789',
    trainer: data?.trainer ?? '123456789',
    date: data?.date ?? date.current,
})
