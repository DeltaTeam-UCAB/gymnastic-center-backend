import { TargetType } from 'src/comment/application/models/comment'

export type FindCommentsDTO = {
    targetId: string
    targetType: TargetType
    userId: string
    page: number
    perPage: number
}
