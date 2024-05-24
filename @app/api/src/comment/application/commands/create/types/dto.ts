import { TargetType } from 'src/comment/application/models/comment'

export type CreateCommentDTO = {
    targetId: string
    userId: string
    targetType: TargetType
    description: string
}
