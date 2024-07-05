import { Lesson } from '../../../../../../src/course/application/models/lesson'

export const createLesson = (data?: {
    id?: string
    title?: string
    content?: string
    video?: string
    image?: string
    order?: number
}): Lesson => ({
    id: data?.id ?? '123456789',
    title: data?.title ?? 'test lesson',
    content: data?.content ?? 'test content',
    order: data?.order ?? 1,
    video: data?.video ?? '48efda30-7829-4632-8d81-14968ceafc27',
    image: data?.image,
})
