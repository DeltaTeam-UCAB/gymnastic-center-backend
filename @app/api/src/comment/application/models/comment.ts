export const targetTypes = ['BLOG', 'LESSON'] as const

export type TargetType = (typeof targetTypes)[number]

export type Comment = {
    id: string
    targetId: string
    targetType: TargetType
    userId: string
    description: string
    likes: string[]
    dislikes: string[]
    creationDate: Date
}
