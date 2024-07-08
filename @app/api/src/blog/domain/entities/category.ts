import { Entity } from 'src/core/domain/entity/entity'
import { CategoryId } from '../value-objects/category.id'
import { CategoryName } from '../value-objects/category.name'
import { Clonable } from 'src/core/domain/clonable/clonable'

export class Category extends Entity<CategoryId> implements Clonable<Category> {
    constructor(
        id: CategoryId,
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
