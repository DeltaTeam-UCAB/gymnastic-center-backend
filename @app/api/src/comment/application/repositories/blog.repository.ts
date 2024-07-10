import { BlogID } from 'src/comment/domain/value-objects/blog.id'

export interface BlogRepository {
    existsById(id: BlogID): Promise<boolean>
}
