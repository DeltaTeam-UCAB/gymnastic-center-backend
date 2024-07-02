import { Result } from 'src/core/application/result-handler/result.handler'
import { Blog } from '../../domain/blog'
import { Optional } from '@mono/types-utils'
import { GetAllBlogsDTO } from '../queries/getAll/types/dto'
import { BlogTitle } from 'src/blog/domain/value-objects/blog.title'
import { BlogId } from 'src/blog/domain/value-objects/blog.id'
import { TrainerId } from 'src/blog/domain/value-objects/trainer.id'

export interface BlogRepository {
    save(blog: Blog): Promise<Result<Blog>>
    existByTitle(title: BlogTitle): Promise<boolean>
    getById(id: BlogId): Promise<Optional<Blog>>
    getAll(filters: GetAllBlogsDTO): Promise<Blog[]>
    countByTrainer(id: TrainerId): Promise<number>
}
