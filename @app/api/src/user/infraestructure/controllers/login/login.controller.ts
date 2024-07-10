import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { LoginDTO } from './dto/login.dto'
import { Body, HttpCode, HttpException, Inject, Post } from '@nestjs/common'
import { SHA256_CRYPTO } from 'src/core/infraestructure/crypto/sha256/sha256.module'
import { Crypto } from 'src/core/application/crypto/crypto'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { JWT_PROVIDER_TOKEN } from 'src/core/infraestructure/token/jwt/module/jwt.provider.module'
import { JwtProviderService } from 'src/core/infraestructure/token/jwt/service/jwt.provider.service'
import { UserPostgresRepository } from '../../repositories/postgres/user.repository'
import { LoginResponse } from 'src/user/application/commads/login/types/response'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { LoginCommand } from 'src/user/application/commads/login/login.command'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { CurrentUserQuery } from 'src/user/application/queries/current/current.query'
import { TokenPayload } from 'src/user/application/commads/login/types/token.payload'
import { UserRedisRepositoryProxy } from '../../repositories/redis/user.repository.proxy'

@Controller({
    path: 'auth',
    docTitle: 'Auth',
})
export class LoginController
implements
        ControllerContract<
            [body: LoginDTO],
            LoginResponse & {
                user: CurrentUserResponse
            }
        >
{
    constructor(
        @Inject(SHA256_CRYPTO) private crypto: Crypto,
        private userRepo: UserPostgresRepository,
        @Inject(JWT_PROVIDER_TOKEN) private jwtProvider: JwtProviderService,
    ) {}
    @Post('login')
    @HttpCode(200)
    async execute(@Body() body: LoginDTO): Promise<
        LoginResponse & {
            user: CurrentUserResponse
        }
    > {
        const tokenProvider = this.jwtProvider.create<TokenPayload>()
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new LoginCommand(
                    new UserRedisRepositoryProxy(this.userRepo),
                    this.crypto,
                    tokenProvider,
                ),
                new NestLogger('Login'),
            ),
            (e) => new HttpException(e.message, 400),
        ).execute(body)
        const data = result.unwrap()
        return {
            ...data,
            user: (
                await new CurrentUserQuery(
                    new UserRedisRepositoryProxy(this.userRepo),
                    tokenProvider,
                ).execute({
                    token: data.token,
                })
            ).unwrap(),
        }
    }
}
