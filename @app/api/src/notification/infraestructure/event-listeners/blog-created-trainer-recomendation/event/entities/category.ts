import { Entity } from 'src/core/domain/entity/entity'
import { CategoryId } from '../value-objects/category.id'
import { CategoryName } from '../value-objects/category.name'

export class Category extends Entity<CategoryId> {
    constructor(
        id: CategoryId,
        private data: {
            name: CategoryName
        },
    ) {
        super(id)
    }

    get name() {
        return this.data.name
    }
}
