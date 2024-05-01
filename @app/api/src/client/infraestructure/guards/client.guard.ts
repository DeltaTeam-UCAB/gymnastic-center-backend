import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JWT_PROVIDER_TOKEN } from 'src/core/infraestructure/token/jwt/module/jwt.provider.module'
import { JwtProviderService } from 'src/core/infraestructure/token/jwt/service/jwt.provider.service'
import { JwtPayload } from '../payloads/jwt.payload'
import { Client } from '../models/postgres/client.entity'

@Injectable()
export class ClientGuard implements CanActivate {
    constructor(
        @InjectRepository(Client) private clientRepo: Repository<Client>,
        @Inject(JWT_PROVIDER_TOKEN) private jwtProvider: JwtProviderService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = request.headers.auth
        const result = this.jwtProvider.create<JwtPayload>().verify(token)
        if (result.isError()) throw new UnauthorizedException()
        const data = result.unwrap()
        const client = await this.clientRepo.findOneBy({
            userId: data.id,
        })
        request.client = client
        return true
    }
}
