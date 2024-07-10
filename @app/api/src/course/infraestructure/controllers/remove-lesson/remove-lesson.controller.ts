import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { COURSE_DOC_PREFIX, COURSE_ROUTE_PREFIX } from '../prefix'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { AddLessonResponse } from 'src/course/application/commands/add-lesson/types/response'
import {
    Delete,
    HttpException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { UserGuard } from '../../guards/user.guard'
import { PostgresTransactionProvider } from 'src/core/infraestructure/repositories/transaction/postgres.transaction'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { CoursePostgresTransactionalRepository } from '../../repositories/postgres/course.repository.transactional'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { TransactionHandlerDecorator } from 'src/core/application/decorators/transaction.handler.decorator'
import { DomainErrorParserDecorator } from 'src/core/application/decorators/domain.error.parser'
import { RemoveLessonCommand } from 'src/course/application/commands/remove-lesson/remove.lesson.command'

@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
    bearerAuth: true,
})
export class RemoveLessonController
    implements
        ControllerContract<[course: string, lesson: string], AddLessonResponse>
{
    constructor(
        private transactionProvider: PostgresTransactionProvider,
        private eventPublisher: RabbitMQEventHandler,
    ) {}

    @Delete('remove/lesson/:course/:lesson')
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Param('course', ParseUUIDPipe) courseId: string,
        @Param('lesson', ParseUUIDPipe) lessonId: string,
    ): Promise<AddLessonResponse> {
        const manager = await this.transactionProvider.create()
        const courseRepository = new CoursePostgresTransactionalRepository(
            manager.queryRunner,
        )
        const nestLogger = new NestLogger('Remove lesson logger')

        const result = await new ErrorDecorator(
            new TransactionHandlerDecorator(
                new LoggerDecorator(
                    new DomainErrorParserDecorator(
                        new RemoveLessonCommand(
                            courseRepository,
                            this.eventPublisher,
                        ),
                    ),
                    nestLogger,
                ),
                manager.transactionHandler,
            ),
            (e) => {
                return new HttpException(e.message, 404)
            },
        ).execute({
            courseId,
            lessonId,
        })
        return result.unwrap()
    }
}
