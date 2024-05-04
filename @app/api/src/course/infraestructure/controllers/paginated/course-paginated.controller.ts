import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Course } from '../../models/postgres/course.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Get, Query, UseGuards } from '@nestjs/common'
import { UserGuard } from 'src/client/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { Image } from 'src/image/infraestructure/models/postgres/image'

@Controller({
    path: 'course',
    docTitle: 'Course',
})
export class GetCoursesPaginated
    implements ControllerContract<[limit: number, offset: number], Course[]>
{
    constructor(
        @InjectRepository(Course) private courseRepo: Repository<Course>,
        @InjectRepository(Image)
        private readonly imageRepo: Repository<Image>,
    ) {}

    @Get('paginated')
    @UseGuards(UserGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Query('limit') limit: number,
        @Query('offset') offset: number,
    ): Promise<Course[]> {
        return this.courseRepo
            .find({
                take: limit,
                skip: offset,
            })
            .map(async (e) => ({
                ...e,
                description: '',
                image: (
                    await this.imageRepo.findOneByOrFail({
                        id: e.image,
                    })
                ).src,
            }))
    }
}
