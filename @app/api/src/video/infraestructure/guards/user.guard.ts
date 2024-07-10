import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { JWT_PROVIDER_TOKEN } from 'src/core/infraestructure/token/jwt/module/jwt.provider.module'
import { JwtProviderService } from 'src/core/infraestructure/token/jwt/service/jwt.provider.service'
import { UserRedisRepositoryProxy } from '../repositories/redis/user.repository.proxy'
import { UserPostgresByVideoRepository } from '../repositories/postgres/user.repository'
import { CurrentUserQuery } from '../auth/current/current.query'

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private userRepo: UserPostgresByVideoRepository,
        @Inject(JWT_PROVIDER_TOKEN) private jwtProvider: JwtProviderService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = request.headers.authorization?.replace('Bearer ', '')
        const result = await new CurrentUserQuery(
            new UserRedisRepositoryProxy(this.userRepo),
            this.jwtProvider.create(),
        ).execute({
            token,
        })
        if (result.isError())
            result.handleError(() => {
                throw new UnauthorizedException()
            })
        request.user = result.unwrap()
        return true
    }
}
