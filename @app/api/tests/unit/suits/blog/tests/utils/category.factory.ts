import { Category } from '../../../../../../src/blog/domain/entities/category'
import { CategoryId } from '../../../../../../src/blog/domain/value-objects/category.id'
import { CategoryName } from '../../../../../../src/blog/domain/value-objects/category.name'

export const createCategory = (data?: { id?: string; name?: string }) =>
    new Category(
        new CategoryId(data?.id ?? '84821c3f-0e66-4bf4-a3a8-520e42e54125'),
        {
            name: new CategoryName(data?.name ?? 'category name'),
        },
    )
