export type GetSubscribedCoursesResponse = {
    id: string
    title: string
    description: string
    trainer: string
    date: Date
    updateDate?: Date
    category: string
    image: string
    progress: number
}[]
