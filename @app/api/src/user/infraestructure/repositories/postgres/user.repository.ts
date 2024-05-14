import { Optional } from '@mono/types-utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { User } from 'src/user/application/models/user'
import { UserRepository } from 'src/user/application/repositories/user.repository'
import { User as UserORM } from '../../models/postgres/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserPostgresRepository implements UserRepository {
    constructor(
        @InjectRepository(UserORM) private userProvider: Repository<UserORM>,
    ) {}

    async save(user: User): Promise<Result<User>> {
        await this.userProvider.upsert(this.userProvider.create(user), ['id'])
        return Result.success(user)
    }

    async getById(id: string): Promise<Optional<User>> {
        const user = await this.userProvider.findOneBy({
            id,
        })
        return user
    }

    async getByEmail(email: string): Promise<Optional<User>> {
        const user = await this.userProvider.findOneBy({
            email,
        })
        return user
    }

    existByEmail(email: string): Promise<boolean> {
        return this.userProvider.existsBy({
            email,
        })
    }
}
