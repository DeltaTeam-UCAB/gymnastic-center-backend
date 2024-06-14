import { Course } from '../../../../../../src/course/application/models/course'
import { Lesson } from '../../../../../../src/course/application/models/lesson'

export const createCourse = (data: {
    id?: string
    title?: string
    description?: string
    trainer: string
    creationDate?: Date
    category: string
    videoId?: string
    imageId?: string
    lessons?: Lesson[]
    tags?: string[]
}): Course => ({
    id: data?.id ?? '1234567890',
    title: data?.title ?? 'test course',
    description: data?.description ?? 'test made for course description',
    trainer: data.trainer,
    date: data?.creationDate ?? new Date(),
    category: data.category,
    image: data?.imageId ?? '6543210987',
    lessons: data.lessons ?? [],
    level: '',
    tags: data.tags ?? [],
})
