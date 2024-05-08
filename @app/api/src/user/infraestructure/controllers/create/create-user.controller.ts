import { Body, HttpException, Inject, Post } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { CreateUserDTO } from './dto/create.user.dto'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { Crypto } from 'src/core/application/crypto/crypto'
import { SHA256_CRYPTO } from 'src/core/infraestructure/crypto/sha256/sha256.module'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../models/postgres/user.entity'
import { Repository } from 'typeorm'

@Controller({
    path: 'user',
    docTitle: 'User',
})
export class CreateUserController
    implements
        ControllerContract<
            [body: CreateUserDTO],
            {
                id: string
            }
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        @Inject(SHA256_CRYPTO) private crypto: Crypto,
        @InjectRepository(User) private userRepo: Repository<User>,
    ) {}
    @Post('create')
    async execute(@Body() body: CreateUserDTO): Promise<{ id: string }> {
        const possibleUser = await this.userRepo.findOneBy({
            email: body.email,
        })
        if (possibleUser) throw new HttpException('Wrong credentials', 400)
        const userId = this.idGen.generate()
        await this.userRepo.save({
            id: userId,
            ...body,
            password: await this.crypto.encrypt(body.password),
        })
        return {
            id: userId,
        }
    }
}
