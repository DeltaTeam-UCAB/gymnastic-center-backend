import { Body, HttpException, Inject, Post } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { CreateUserDTO } from './dto/create.user.dto'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { Crypto } from 'src/core/application/crypto/crypto'
import { SHA256_CRYPTO } from 'src/core/infraestructure/crypto/sha256/sha256.module'
import { UserPostgresRepository } from '../../repositories/postgres/user.repository'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { CreateUserCommand } from 'src/user/application/commads/create/create.user.command'
import { CreateUserResponse } from 'src/user/application/commads/create/types/response'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { UserRedisRepositoryProxy } from '../../repositories/redis/user.repository.proxy'

@Controller({
    path: 'auth',
    docTitle: 'Auth',
})
export class CreateUserController
implements ControllerContract<[body: CreateUserDTO], CreateUserResponse>
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        @Inject(SHA256_CRYPTO) private crypto: Crypto,
        private userRepo: UserPostgresRepository,
    ) {}
    @Post('register')
    async execute(@Body() body: CreateUserDTO): Promise<CreateUserResponse> {
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new CreateUserCommand(
                    this.idGen,
                    this.crypto,
                    new UserRedisRepositoryProxy(this.userRepo),
                ),
                new NestLogger('CreateUser'),
            ),
            (e) => new HttpException(e.message, 400),
        ).execute(body)
        return result.unwrap()
    }
}
