

export type Course = {
    id: string
    title: string
    description: string
    instructor: string
    calories: number
    creationDate: Date
    updateDate?: Date
    category: string
    videoId?: string
    imageId: string
}