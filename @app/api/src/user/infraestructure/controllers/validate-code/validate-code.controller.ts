import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { ValidateCodeDTO } from './dto/dto'
import { UserPostgresRepository } from '../../repositories/postgres/user.repository'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { ValidRecoveryCodeQuery } from 'src/user/application/queries/valid-recovery/valid.recovery.query'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'
import { Body, HttpException, Post } from '@nestjs/common'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { UserRedisRepositoryProxy } from '../../repositories/redis/user.repository.proxy'

@Controller({
    path: 'auth',
    docTitle: 'Auth',
})
export class ValidateCodeController
implements ControllerContract<[body: ValidateCodeDTO], void>
{
    constructor(private userRepository: UserPostgresRepository) {}
    @Post('code/validate')
    async execute(@Body() body: ValidateCodeDTO): Promise<void> {
        await new ErrorDecorator(
            new LoggerDecorator(
                new ValidRecoveryCodeQuery(
                    new UserRedisRepositoryProxy(this.userRepository),
                    new ConcreteDateProvider(),
                ),
                new NestLogger('ValidateCode'),
            ),
            (e) => new HttpException(e.message, 400),
        ).execute(body)
    }
}
