export type FindCommentsResponse = {
    id: string
    user: string
    userId: string
    countLikes: number
    countDislikes: number
    body: string
    userLiked?: boolean
    userDisliked?: boolean
    date: Date
}
