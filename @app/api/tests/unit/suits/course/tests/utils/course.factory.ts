import { Course } from '../../../../../../src/course/application/models/course'
import { DateProviderMock } from './date.provider.mock'

const date = new DateProviderMock(new Date())
export const createCourse = (data?: {
    id?: string
    title?: string
    description?: string
    instructor?: string
    calories?: number
    creationDate?: Date
    category?: string
    videoId?: string
    imageId?: string
}): Course => ({
    id: data?.id ?? '1234567890',
    title: data?.title ?? 'test course',
    description: data?.description ?? 'test made for course description',
    instructor: data?.instructor ?? 'Instructor name',
    calories: data?.calories ?? 1234,
    creationDate: data?.creationDate ?? date.current,
    category: data?.category ?? 'category test',
    videoId: data?.videoId ?? '9876543210',
    imageId: data?.imageId ?? '6543210987',
})

