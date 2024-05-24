export type FindCommentsResponse = {
    id: string
    user: string
    countLikes: number
    countDislikes: number
    body: string
    userLiked?: boolean
    userDisliked?: boolean
    date: Date
}
