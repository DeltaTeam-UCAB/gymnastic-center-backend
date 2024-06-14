export type GetBlogByIdResponse = {
    id: string
    title: string
    description: string
    category: string
    tags: string[]
    images: string[]
    trainer: {
        id: string
        name: string
    }
    date: Date
}
