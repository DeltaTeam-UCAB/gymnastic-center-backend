import { Optional } from '@mono/types-utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Category as CategoryORM } from '../../models/postgres/category.entity'
import { Repository } from 'typeorm'
import { CategoryRepository } from 'src/notification/application/repositories/category.repository'
import { Category } from 'src/notification/application/models/category'

@Injectable()
export class CategoryPostgresByNotificationRepository
    implements CategoryRepository
{
    constructor(
        @InjectRepository(CategoryORM)
        private categoryProvider: Repository<CategoryORM>,
    ) {}
    getById(id: string): Promise<Optional<Category>> {
        return this.categoryProvider.findOneBy({
            id,
        })
    }
}
