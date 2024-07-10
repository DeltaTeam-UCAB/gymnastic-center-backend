import { Optional } from '@mono/types-utils'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'
import { UserRepository } from '../../auth/user.repository'
import { User } from '../../auth/user'

export class UserRedisRepositoryProxy implements UserRepository {
    constructor(private userRepository: UserRepository) {}
    async getById(id: string): Promise<Optional<User>> {
        const possibleUser = (await redisClient.hGetAll(
            'user-detail:' + id,
        )) as Record<string, string>
        if (possibleUser.id)
            return {
                email: possibleUser['email'],
                id: possibleUser['id'],
                password: possibleUser['password'],
                name: possibleUser['name'],
                type: possibleUser['type'] as any,
            }
        const user = await this.userRepository.getById(id)
        return user
    }
}
