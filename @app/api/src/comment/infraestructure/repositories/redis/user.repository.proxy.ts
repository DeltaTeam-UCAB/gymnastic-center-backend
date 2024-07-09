import { Optional } from '@mono/types-utils'
import { UserRepository } from 'src/comment/application/repositories/user.repository'
import { Client } from 'src/comment/domain/entities/client'
import { ClientID } from 'src/comment/domain/value-objects/client.id'
import { ClientName } from 'src/comment/domain/value-objects/client.name'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'

export class UserRedisRepositoryProxy implements UserRepository {
    constructor(private userRepository: UserRepository) {}
    async getById(id: ClientID): Promise<Optional<Client>> {
        const possibleUser = (await redisClient.hGetAll(
            'user:' + id.id,
        )) as Optional<{
            id: string
            name: string
        }>
        if (possibleUser?.id)
            return new Client(id, {
                name: new ClientName(possibleUser.name),
            })
        const user = await this.userRepository.getById(id)
        if (user)
            await redisClient.hSet('user:' + id.id, {
                id: id.id,
                name: user.name.name,
            })
        return user
    }
}
