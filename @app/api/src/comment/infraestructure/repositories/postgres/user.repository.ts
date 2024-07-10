import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from 'src/comment/application/repositories/user.repository'
import { Client } from 'src/comment/domain/entities/client'
import { ClientID } from 'src/comment/domain/value-objects/client.id'
import { ClientName } from 'src/comment/domain/value-objects/client.name'
import { User as UserORM } from 'src/comment/infraestructure/models/postgres/user.entity'
import { Repository } from 'typeorm'

export class UserByCommentPostgresRepository implements UserRepository {
    constructor(
        @InjectRepository(UserORM)
        private userRespository: Repository<UserORM>,
    ) {}

    async getById(id: ClientID): Promise<Optional<Client>> {
        const exists = await this.userRespository.existsBy({ id: id.id })
        if (!exists) return null
        const userORM = (await this.userRespository.findOne({
            where: {
                id: id.id,
            },
            select: {
                id: true,
                name: true,
            },
        })) as unknown as UserORM
        return new Client(id, {
            name: new ClientName(userORM.name),
        })
    }
}
