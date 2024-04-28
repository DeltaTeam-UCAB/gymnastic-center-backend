import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { LoginDTO } from './dto/login.dto'
import { Body, HttpException, Inject, Post } from '@nestjs/common'
import { SHA256_CRYPTO } from 'src/core/infraestructure/crypto/sha256/sha256.module'
import { Crypto } from 'src/core/application/crypto/crypto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../models/postgres/user.entity'
import { Repository } from 'typeorm'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { JWT_PROVIDER_TOKEN } from 'src/core/infraestructure/token/jwt/module/jwt.provider.module'
import { JwtProviderService } from 'src/core/infraestructure/token/jwt/service/jwt.provider.service'
import { JwtPayload } from '../../payloads/jwt.payload'

@Controller({
    path: 'user',
    docTitle: 'User',
})
export class LoginController
    implements
        ControllerContract<
            [body: LoginDTO],
            {
                token: string
                type: string
            }
        >
{
    constructor(
        @Inject(SHA256_CRYPTO) private crypto: Crypto,
        @InjectRepository(User) private userRepo: Repository<User>,
        @Inject(JWT_PROVIDER_TOKEN) private jwtProvider: JwtProviderService,
    ) {}
    @Post('login')
    async execute(
        @Body() body: LoginDTO,
    ): Promise<{ token: string; type: string }> {
        const user = await this.userRepo.findOneBy({
            email: body.email,
        })
        if (!user || !(await this.crypto.compare(body.password, user.password)))
            throw new HttpException('Wrong credentials', 400)
        const token = this.jwtProvider.create<JwtPayload>().sign({
            id: user.id,
        })
        return {
            token: token.unwrap(),
            type: user.type,
        }
    }
}
