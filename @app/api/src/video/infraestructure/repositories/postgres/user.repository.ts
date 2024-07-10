import { Optional } from '@mono/types-utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User as UserORM } from '../../models/postgres/user.entity'
import { Repository } from 'typeorm'
import { UserRepository } from '../../auth/user.repository'
import { User } from '../../auth/user'

@Injectable()
export class UserPostgresByVideoRepository implements UserRepository {
    constructor(
        @InjectRepository(UserORM) private userProvider: Repository<UserORM>,
    ) {}

    async getById(id: string): Promise<Optional<User>> {
        const user = await this.userProvider.findOneBy({
            id,
        })
        return user
    }
}
