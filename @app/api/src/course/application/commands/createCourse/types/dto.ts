export type CreateCourseDTO = {
    title: string
    description: string
    trainer: string
    category: string
    image: string
    level: string
    tags: string[]
    lessons: {
        title: string
        content: string
        video?: string
        image?: string
        order: number
    }[]
}
