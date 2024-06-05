import { Category } from '../../../../../../src/blog/application/models/category'

export const createCategory = (data?: {
    id?: string
    name?: string
}): Category => ({
    id: data?.id ?? '1234567890',
    name: data?.name ?? 'test category',
})
