import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { ChangePasswordDTO } from './dto/dto'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { UserPostgresRepository } from '../../repositories/postgres/user.repository'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { ChangePasswordCommand } from 'src/user/application/commads/change-password/change.password.command'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'
import { Body, HttpException, Inject, Put } from '@nestjs/common'
import { SHA256_CRYPTO } from 'src/core/infraestructure/crypto/sha256/sha256.module'
import { Crypto } from 'src/core/application/crypto/crypto'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { UserRedisRepositoryProxy } from '../../repositories/redis/user.repository.proxy'

@Controller({
    path: 'auth',
    docTitle: 'Auth',
    bearerAuth: true,
})
export class ChangePasswordController
implements
        ControllerContract<
            [body: ChangePasswordDTO, user: CurrentUserResponse],
            void
        >
{
    constructor(
        private userRepository: UserPostgresRepository,
        @Inject(SHA256_CRYPTO) private crypto: Crypto,
    ) {}
    @Put('change/password')
    async execute(@Body() body: ChangePasswordDTO): Promise<void> {
        await new ErrorDecorator(
            new LoggerDecorator(
                new ChangePasswordCommand(
                    new UserRedisRepositoryProxy(this.userRepository),
                    new ConcreteDateProvider(),
                    this.crypto,
                ),
                new NestLogger('ChangePassword'),
            ),
            (e) => new HttpException(e.message, 400),
        ).execute(body)
    }
}
