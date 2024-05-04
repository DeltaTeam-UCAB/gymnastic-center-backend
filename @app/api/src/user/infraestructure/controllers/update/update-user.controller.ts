import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { User } from '../../models/postgres/user.entity'
import { UpdateUserDTO } from './dto/update.user.dto'
import { User as UserDecorator } from '../../decorators/user.decorator'
import { Body, HttpException, Inject, Put, UseGuards } from '@nestjs/common'
import { UserGuard } from '../../guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { SHA256_CRYPTO } from 'src/core/infraestructure/crypto/sha256/sha256.module'
import { Crypto } from 'src/core/application/crypto/crypto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Controller({
    path: 'user',
    docTitle: 'User',
})
export class UpdateUserController
    implements
        ControllerContract<
            [user: User, data: UpdateUserDTO],
            {
                id: string
            }
        >
{
    constructor(
        @Inject(SHA256_CRYPTO) private crypto: Crypto,
        @InjectRepository(User) private userRepo: Repository<User>,
    ) {}
    @Put('update')
    @UseGuards(UserGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @UserDecorator() user: User,
        @Body() data: UpdateUserDTO,
    ): Promise<{ id: string }> {
        if (data.email) {
            const possibleUser = await this.userRepo.findOneBy({
                email: data.email,
            })
            if (possibleUser && possibleUser.id !== user.id)
                throw new HttpException('Wrong credentials', 400)
        }
        if (data.password)
            data.password = await this.crypto.encrypt(data.password)
        await this.userRepo.update(
            {
                id: user.id,
            },
            data,
        )
        return {
            id: user.id,
        }
    }
}
