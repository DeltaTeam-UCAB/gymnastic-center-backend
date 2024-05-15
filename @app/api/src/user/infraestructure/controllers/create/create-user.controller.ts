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
import { CryptoRandomCodeGenerator } from 'src/core/infraestructure/random-code/random-code.crypto.generator'
import { CreateUserResponse } from 'src/user/application/commads/create/types/response'

@Controller({
    path: 'user',
    docTitle: 'User',
})
export class CreateUserController
implements ControllerContract<[body: CreateUserDTO], CreateUserResponse>
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        @Inject(SHA256_CRYPTO) private crypto: Crypto,
        private userRepo: UserPostgresRepository,
    ) {}
    @Post('create')
    async execute(@Body() body: CreateUserDTO): Promise<CreateUserResponse> {
        const result = await new ErrorDecorator(
            new CreateUserCommand(
                this.idGen,
                this.crypto,
                this.userRepo,
                new CryptoRandomCodeGenerator(),
            ),
            (e) => new HttpException(e.message, 400),
        ).execute(body)
        return result.unwrap()
    }
}
