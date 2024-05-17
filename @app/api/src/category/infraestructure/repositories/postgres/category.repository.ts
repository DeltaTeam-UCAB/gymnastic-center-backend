import { Optional } from '@mono/types-utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from 'src/category/application/models/category'
import { CategoryRepository } from 'src/category/application/repositories/category.repository'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Category as CategoryORM } from '../../models/postgres/category.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CategoryPostgresRepository implements CategoryRepository {
    constructor(
        @InjectRepository(CategoryORM)
        private categoryProvider: Repository<CategoryORM>,
    ) {}
    async save(category: Category): Promise<Result<Category>> {
        await this.categoryProvider.upsert(
            this.categoryProvider.create(category),
            ['id'],
        )
        return Result.success(category)
    }
    findByName(name: string): Promise<Optional<Category>> {
        return this.categoryProvider.findOneBy({
            name,
        })
    }
}
