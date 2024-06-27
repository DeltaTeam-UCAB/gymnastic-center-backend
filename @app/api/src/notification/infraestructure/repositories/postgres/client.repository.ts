import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Client } from 'src/notification/application/models/client'
import { ClientRepository } from 'src/notification/application/repositories/client.repository'
import { User } from '../../models/postgres/user.entity'
import { Repository } from 'typeorm'

export class ClientPostgresByNotificationRepository
    implements ClientRepository
{
    constructor(
        @InjectRepository(User) private userProvider: Repository<User>,
    ) {}
    getById(id: string): Promise<Optional<Client>> {
        return this.userProvider.findOneBy({
            id,
        })
    }
}
