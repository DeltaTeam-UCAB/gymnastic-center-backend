import { LEVELS } from 'src/course/domain/value-objects/course.level'

export type CreateCourseDTO = {
    title: string
    description: string
    trainer: string
    category: string
    image: string
    level: LEVELS
    weeks: number
    hours: number
    tags: string[]
    lessons: {
        title: string
        content: string
        video: string
        image?: string
        order: number
    }[]
}
