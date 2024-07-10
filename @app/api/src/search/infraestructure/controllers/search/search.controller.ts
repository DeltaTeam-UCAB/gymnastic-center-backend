import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { SearchDTO } from './dto/dto'
import { GetAllBlogResponse } from 'src/search/application/queries/search-blogs/types/response'
import { GetCoursesManyResponse } from 'src/search/application/queries/search-courses/types/response'
import { Get, Query, UseGuards } from '@nestjs/common'
import { SearchCoursesQuery } from 'src/search/application/queries/search-courses/course.search.query'
import { CoursePostgresBySearchRepository } from '../../repositories/postgres/course.repository'
import { BlogPostgresBySearchRepository } from '../../repositories/postgres/blog.repository'
import { ImagePostgresBySearchRepository } from '../../repositories/postgres/image.repository'
import { SearchBlogsQuery } from 'src/search/application/queries/search-blogs/search.blog.query'
import { UserGuard } from '../../guards/user.guard'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ImageRedisRepositoryProxy } from '../../repositories/redis/image.repository.proxy'

@Controller({
    path: 'search',
    docTitle: 'Search',
    bearerAuth: true,
})
export class SearchController
implements
        ControllerContract<
            [data: SearchDTO],
            {
                blogs: GetAllBlogResponse[]
                courses: GetCoursesManyResponse
            }
        >
{
    constructor(
        private courseRepository: CoursePostgresBySearchRepository,
        private blogRepository: BlogPostgresBySearchRepository,
        private imageRepository: ImagePostgresBySearchRepository,
    ) {}
    @Get('all')
    @UseGuards(UserGuard)
    async execute(@Query() data: SearchDTO): Promise<{
        blogs: GetAllBlogResponse[]
        courses: GetCoursesManyResponse
    }> {
        const res = await Promise.parallel({
            courses: new SearchCoursesQuery(
                this.courseRepository,
                new ImageRedisRepositoryProxy(this.imageRepository),
            ).execute(data),
            blogs: new SearchBlogsQuery(
                this.blogRepository,
                new ImageRedisRepositoryProxy(this.imageRepository),
            ).execute(data),
        })
        return {
            courses: res.courses.unwrap(),
            blogs: res.blogs.unwrap(),
        }
    }
}
