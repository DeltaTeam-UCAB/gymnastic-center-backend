import { TargetType } from 'src/comment/application/types/target-type'

export type FindCommentsDTO = {
    targetId: string
    targetType: TargetType
    userId: string
    page: number
    perPage: number
}
