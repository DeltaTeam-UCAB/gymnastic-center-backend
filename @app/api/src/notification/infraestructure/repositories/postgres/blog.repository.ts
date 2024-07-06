import { InjectRepository } from '@nestjs/typeorm'
import { Blog as BlogORM } from '../../models/postgres/blog.entity'
import { Repository } from 'typeorm'
import { BlogRepository } from 'src/notification/application/repositories/blog.repository'
import { Optional } from '@mono/types-utils'
import { Blog } from 'src/notification/application/models/blog'

export class BlogPostgresByNotificationRepository implements BlogRepository {
    constructor(
        @InjectRepository(BlogORM)
        private blogProvider: Repository<BlogORM>,
    ) {}

    getById(id: string): Promise<Optional<Blog>> {
        return this.blogProvider.findOneBy({
            id,
            active: true,
        })
    }
}
