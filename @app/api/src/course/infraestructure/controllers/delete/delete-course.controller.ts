import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { COURSE_DOC_PREFIX, COURSE_ROUTE_PREFIX } from '../prefix'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { DeleteCourseResponse } from 'src/course/application/commands/delete/types/response'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { CoursePostgresRepository } from '../../repositories/postgres/course.repository'
import {
    Delete,
    HttpException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { DeleteCourseCommand } from 'src/course/application/commands/delete/delete.command'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'

@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
    bearerAuth: true,
})
export class DeleteCourseController
    implements ControllerContract<[id: string], DeleteCourseResponse>
{
    constructor(
        private eventPublisher: RabbitMQEventHandler,
        private courseRepository: CoursePostgresRepository,
    ) {}
    @Delete('one/:id')
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<DeleteCourseResponse> {
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new DeleteCourseCommand(
                    this.courseRepository,
                    this.eventPublisher,
                ),
                new NestLogger('Delete course'),
            ),
            (e) => new HttpException(e.message, 404),
        ).execute({
            id,
        })
        return result.unwrap()
    }
}
