import { Lesson } from 'src/course/application/models/lesson'
export type GetCourseDetailsResponse = {
    id: string
    title: string
    description: string
    trainer: {
        id: string
        name: string
    }
    category: string
    image: string
    level: string
    date: Date
    lessons: Lesson[]
    tags: string[]
}
