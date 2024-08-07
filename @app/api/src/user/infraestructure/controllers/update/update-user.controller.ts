import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { UpdateUserDTO } from './dto/update.user.dto'
import { User as UserDecorator } from '../../decorators/user.decorator'
import { Body, HttpException, Inject, Put, UseGuards } from '@nestjs/common'
import { UserGuard } from '../../guards/user.guard'
import { SHA256_CRYPTO } from 'src/core/infraestructure/crypto/sha256/sha256.module'
import { Crypto } from 'src/core/application/crypto/crypto'
import { UserPostgresRepository } from '../../repositories/postgres/user.repository'
import { UpdateUserResponse } from 'src/user/application/commads/update/types/response'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { UpdateUserCommand } from 'src/user/application/commads/update/update.user.command'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { AuditDecorator } from 'src/core/application/decorators/audit.decorator'
import { AuditingTxtRepository } from 'src/core/infraestructure/auditing/repositories/txt/auditing.repository'
import { UserRedisRepositoryProxy } from '../../repositories/redis/user.repository.proxy'

@Controller({
    path: 'user',
    docTitle: 'User',
    bearerAuth: true,
})
export class UpdateUserController
implements
        ControllerContract<
            [user: CurrentUserResponse, data: UpdateUserDTO],
            UpdateUserResponse
        >
{
    constructor(
        @Inject(SHA256_CRYPTO) private crypto: Crypto,
        private userRepo: UserPostgresRepository,
    ) {}
    @Put('update')
    @UseGuards(UserGuard)
    async execute(
        @UserDecorator() user: CurrentUserResponse,
        @Body() data: UpdateUserDTO,
    ): Promise<UpdateUserResponse> {
        const audit = {
            user: user.id,
            operation: 'Update User',
            succes: true,
            ocurredOn: new Date(Date.now()),
            data: JSON.stringify(data),
        }

        const result = await new ErrorDecorator(
            new AuditDecorator(
                new LoggerDecorator(
                    new UpdateUserCommand(
                        this.crypto,
                        new UserRedisRepositoryProxy(this.userRepo),
                    ),
                    new NestLogger('UpdateUser'),
                ),
                new AuditingTxtRepository(),
                audit,
            ),
            (e) => new HttpException(e.message, 400),
        ).execute({
            id: user.id,
            ...data,
        })
        return result.unwrap()
    }
}
