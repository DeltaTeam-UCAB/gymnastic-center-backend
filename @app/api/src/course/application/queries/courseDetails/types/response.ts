import { Lesson } from "src/course/application/models/lesson"
export type courseDetailsResponse = {
    title: string
    description: string
    calories: number
    instructor: string
    category: string
    image: string
    lessons: Lesson[]
}

//
