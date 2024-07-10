import { TargetType } from 'src/comment/application/types/target-type'

export type CreateCommentDTO = {
    targetId: string
    userId: string
    targetType: TargetType
    description: string
}
