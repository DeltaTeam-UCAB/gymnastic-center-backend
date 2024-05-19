export type CreateCourseDTO = {
    title: string
    description: string
    instructor: string
    calories: number
    creationDate: Date
    category: string
    videoId?: string
    imageId: string
}