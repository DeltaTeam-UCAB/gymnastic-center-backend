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
import { ApiHeader } from '@nestjs/swagger'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'

@Controller({
    path: 'search',
    docTitle: 'Search',
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
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard)
    async execute(@Query() data: SearchDTO): Promise<{
        blogs: GetAllBlogResponse[]
        courses: GetCoursesManyResponse
    }> {
        const res = await Promise.parallel({
            courses: new SearchCoursesQuery(
                this.courseRepository,
                this.imageRepository,
            ).execute(data),
            blogs: new SearchBlogsQuery(
                this.blogRepository,
                this.imageRepository,
            ).execute(data),
        })
        return {
            courses: res.courses.unwrap(),
            blogs: res.blogs.unwrap(),
        }
    }
}
