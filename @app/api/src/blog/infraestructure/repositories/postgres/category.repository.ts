import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from 'src/blog/application/models/category'
import { CategoryRepository } from 'src/blog/application/repositories/category.repository'
import { Category as CategoryORM } from '../../models/postgres/category.entity'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CategoryByBlogPostgresRepository implements CategoryRepository {
    constructor(
        @InjectRepository(CategoryORM)
        private categoryProvider: Repository<CategoryORM>,
    ) {}
    existById(id: string): Promise<boolean> {
        return this.categoryProvider.existsBy({
            id,
        })
    }

    async getById(id: string): Promise<Optional<Category>> {
        const category = await this.categoryProvider.findOneBy({
            id,
        })
        if (!category) return null
        return {
            id: category.id,
            name: category.name,
        }
    }
}
