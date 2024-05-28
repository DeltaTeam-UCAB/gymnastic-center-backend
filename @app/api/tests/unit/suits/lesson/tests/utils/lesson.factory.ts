import { Lesson } from '../../../../../../src/course/application/models/lesson'

export const createLesson = (data?: {
    id?: string
    name?: string
    description?: string
    courseId?: string
    videoId?: string
    order?: number
    waitTime?: number
    burnedCalories?: number
}): Lesson => ({
    id: data?.id ?? '1234567890',
    name: data?.name ?? 'test lesson',
    description: data?.description ?? 'test made for lesson description',
    courseId: data?.courseId ?? '6543210987',
    videoId: data?.videoId ?? '9876543210',
    order: data?.order ?? 1234,
    waitTime: data?.waitTime ?? 321,
    burnedCalories: data?.burnedCalories ?? 1234,
})

