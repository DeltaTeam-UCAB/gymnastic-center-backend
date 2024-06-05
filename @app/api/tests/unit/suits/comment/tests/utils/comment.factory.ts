import {
    Comment,
    TargetType,
} from '../../../../../../src/comment/application/models/comment'

export const createComment = (data?: {
    id?: string
    targetId?: string
    targetType?: TargetType
    creationDate?: Date
    description?: string
    dislikes?: string[]
    likes?: string[]
    userId?: string
}): Comment => ({
    id: data?.id ?? '123456789',
    targetId: data?.targetId ?? '1234',
    targetType: data?.targetType ?? 'BLOG',
    creationDate: data?.creationDate ?? new Date(),
    description: data?.description ?? 'test description',
    dislikes: data?.dislikes ?? [],
    likes: data?.likes ?? [],
    userId: data?.userId ?? '987654321',
})
