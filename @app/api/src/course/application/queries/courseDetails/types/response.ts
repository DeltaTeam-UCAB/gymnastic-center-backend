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
    durationWeeks: number
    durationMinutes: number
    lessons: Lesson[]
    tags: string[]
}
