import { CategoryID } from '../value-objects/category.id'
import { CategoryName } from '../value-objects/category.name'
import { Entity } from 'src/core/domain/entity/entity'

export class Category extends Entity<CategoryID> {
    constructor(
        id: CategoryID,
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
