import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'

import { CategoryRepository } from 'src/blog/application/repositories/category.repository'
import { Category as CategoryORM } from '../../models/postgres/category.entity'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { CategoryId } from 'src/blog/domain/value-objects/category.id'
import { Category } from 'src/blog/domain/entities/category'
import { CategoryName } from 'src/blog/domain/value-objects/category.name'

@Injectable()
export class CategoryByBlogPostgresRepository implements CategoryRepository {
    constructor(
        @InjectRepository(CategoryORM)
        private categoryProvider: Repository<CategoryORM>,
    ) {}

    existById(id: CategoryId): Promise<boolean> {
        return this.categoryProvider.existsBy({
            id: id.id,
        })
    }

    async getById(id: CategoryId): Promise<Optional<Category>> {
        const category = await this.categoryProvider.findOneBy({
            id: id.id,
        })
        if (!category) return null
        return new Category(new CategoryId(category.id), {
            name: new CategoryName(category.name),
        })
    }
}
