import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/comment/application/models/user'
import { UserRepository } from 'src/comment/application/repositories/user.repository'
import { User as UserORM } from 'src/comment/infraestructure/models/postgres/user.entity'
import { Repository } from 'typeorm'

export class UserByCommentPostgresRepository implements UserRepository {
    constructor(
        @InjectRepository(UserORM)
        private userRespository: Repository<UserORM>,
    ) {}

    async getById(id: string): Promise<Optional<User>> {
        return this.userRespository.findOne({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
            },
        })
    }
}
