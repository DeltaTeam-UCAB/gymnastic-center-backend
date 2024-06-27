import { Blog } from '../models/blog'

export type SearchBlogsCriteria = {
    page: number
    perPage: number
    term?: string
    tags?: string[]
}

export interface BlogRepository {
    getMany(criteria: SearchBlogsCriteria): Promise<Blog[]>
}
