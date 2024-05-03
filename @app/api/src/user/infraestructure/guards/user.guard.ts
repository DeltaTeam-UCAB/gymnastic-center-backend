import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../models/postgres/user.entity'
import { Repository } from 'typeorm'
import { JWT_PROVIDER_TOKEN } from 'src/core/infraestructure/token/jwt/module/jwt.provider.module'
import { JwtProviderService } from 'src/core/infraestructure/token/jwt/service/jwt.provider.service'
import { JwtPayload } from '../payloads/jwt.payload'

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @Inject(JWT_PROVIDER_TOKEN) private jwtProvider: JwtProviderService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = request.headers.auth
        const result = this.jwtProvider.create<JwtPayload>().verify(token)
        if (result.isError()) throw new UnauthorizedException()
        const data = result.unwrap()
        const user = await this.userRepo.findOneBy({
            id: data.id,
        })
        request.user = user
        return true
    }
}
