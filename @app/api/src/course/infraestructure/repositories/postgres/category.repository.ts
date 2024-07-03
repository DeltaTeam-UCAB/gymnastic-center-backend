import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoryRepository } from 'src/course/application/repositories/category.repository'
import { Category as CategoryORM } from '../../models/postgres/category.entity'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { CategoryID } from 'src/course/domain/value-objects/category.id'
import { Category } from 'src/course/domain/entities/category'
import { CategoryName } from 'src/course/domain/value-objects/category.name'

@Injectable()
export class CategoryPostgresByCourseRepository implements CategoryRepository {
    constructor(
        @InjectRepository(CategoryORM)
        private categoryProvider: Repository<CategoryORM>,
    ) {}
    existById(id: CategoryID): Promise<boolean> {
        return this.categoryProvider.existsBy({
            id: id.id,
        })
    }

    async getById(id: CategoryID): Promise<Optional<Category>> {
        const category = await this.categoryProvider.findOneBy({
            id: id.id,
        })
        if (!category) return null
        return new Category(id, { name: new CategoryName(category.name) })
    }
}
