import { Category } from '../../../../../../src/course/domain/entities/category'
import { CategoryID } from '../../../../../../src/course/domain/value-objects/category.id'
import { CategoryName } from '../../../../../../src/course/domain/value-objects/category.name'

export const createCategory = (data?: {
    id?: string
    name?: string
}): Category =>
    new Category(
        new CategoryID(data?.id ?? '01fc70fa-d328-479c-a0c2-117aec3ebb2b'),
        { name: new CategoryName(data?.name ?? 'category test name') },
    )
