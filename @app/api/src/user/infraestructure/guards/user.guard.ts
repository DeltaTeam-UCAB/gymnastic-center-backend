import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { JWT_PROVIDER_TOKEN } from 'src/core/infraestructure/token/jwt/module/jwt.provider.module'
import { JwtProviderService } from 'src/core/infraestructure/token/jwt/service/jwt.provider.service'
import { UserPostgresRepository } from '../repositories/postgres/user.repository'
import { CurrentUserQuery } from 'src/user/application/queries/current/current.query'

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private userRepo: UserPostgresRepository,
        @Inject(JWT_PROVIDER_TOKEN) private jwtProvider: JwtProviderService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = request.headers.auth
        const result = await new CurrentUserQuery(
            this.userRepo,
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
