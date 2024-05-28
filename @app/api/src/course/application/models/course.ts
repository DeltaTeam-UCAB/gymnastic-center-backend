import { Lesson } from './lesson'

export type Course = {
    id: string
    title: string
    description: string
    trainer: string
    date: Date
    category: string
    image: string
    level: string
    tags: string[]
    lessons: Lesson[]
}
