import { Category } from '../../../../../../src/course/application/models/category'

export const createCategory = (data?: {
    id?: string
    name?: string
}): Category => ({
    id: data?.id ?? '123456789',
    name: data?.name ?? 'test category',
})
