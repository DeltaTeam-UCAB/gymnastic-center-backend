import { Clonable } from 'src/core/domain/clonable/clonable'
import { CategoryID } from '../value-objects/category.id'
import { CategoryName } from '../value-objects/category.name'
import { Entity } from 'src/core/domain/entity/entity'

export class Category extends Entity<CategoryID> implements Clonable<Category> {
    constructor(
        id: CategoryID,
        private data: {
            name: CategoryName
        },
    ) {
        super(id)
    }

    clone(): Category {
        return new Category(this.id, {
            ...this.data,
        })
    }

    get name() {
        return this.data.name
    }
}
