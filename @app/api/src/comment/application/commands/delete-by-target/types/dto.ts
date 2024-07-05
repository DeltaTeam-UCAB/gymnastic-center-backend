import { TargetType } from 'src/comment/application/types/target-type'

export type DeleteByTargetDTO = {
    targetId: string
    targetType: TargetType
}
