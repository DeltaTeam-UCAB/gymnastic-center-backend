import { Optional } from '@mono/types-utils'
import { Result } from 'src/core/application/result-handler/result.handler'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'
import { User } from 'src/user/application/models/user'
import { UserRepository } from 'src/user/application/repositories/user.repository'

export class UserRedisRepositoryProxy implements UserRepository {
    constructor(private userRepository: UserRepository) {}
    async save(user: User): Promise<Result<User>> {
        const result = await this.userRepository.save(user)
        if (!result.isError()) {
            const userToSave = { ...user }
            if (!userToSave.image) delete userToSave.image
            if (!userToSave.code) delete userToSave.code
            if (!userToSave.recoveryTime) delete userToSave.recoveryTime
            await redisClient.hSet(
                'user-detail:' + user.id,
                JSON.parse(JSON.stringify(userToSave)),
            )
            await redisClient.hSet(
                'user-detail-email:' + user.email,
                JSON.parse(JSON.stringify(userToSave)),
            )
            await redisClient.hSet('user:' + user.id, {
                id: user.id,
                name: user.name,
            })
        }
        return result
    }

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
                phone: possibleUser['phone'],
                image: possibleUser['image'] ?? undefined,
                code: possibleUser['code'] ?? undefined,
                recoveryTime: possibleUser['recoveryTime']
                    ? new Date(possibleUser['recoveryTime'])
                    : undefined,
            }
        const user = await this.userRepository.getById(id)
        if (user) {
            const userToSave = { ...user }
            if (!userToSave.image) delete userToSave.image
            if (!userToSave.code) delete userToSave.code
            if (!userToSave.recoveryTime) delete userToSave.recoveryTime
            await redisClient.hSet(
                'user-detail:' + user.id,
                JSON.parse(JSON.stringify(userToSave)),
            )
            await redisClient.hSet(
                'user-detail-email:' + user.email,
                JSON.parse(JSON.stringify(userToSave)),
            )
        }
        return user
    }

    async getByEmail(email: string): Promise<Optional<User>> {
        const possibleUser = (await redisClient.hGetAll(
            'user-detail-email:' + email,
        )) as Record<string, string>
        if (possibleUser.id)
            return {
                email: possibleUser['email'],
                id: possibleUser['id'],
                password: possibleUser['password'],
                name: possibleUser['name'],
                type: possibleUser['type'] as any,
                phone: possibleUser['phone'],
                image: possibleUser['image'] ?? undefined,
                code: possibleUser['code'] ?? undefined,
                recoveryTime: possibleUser['recoveryTime']
                    ? new Date(possibleUser['recoveryTime'])
                    : undefined,
            }
        const user = await this.userRepository.getByEmail(email)
        if (user) {
            const userToSave = { ...user }
            if (!userToSave.image) delete userToSave.image
            if (!userToSave.code) delete userToSave.code
            if (!userToSave.recoveryTime) delete userToSave.recoveryTime
            await redisClient.hSet(
                'user-detail:' + user.id,
                JSON.parse(JSON.stringify(userToSave)),
            )
            await redisClient.hSet(
                'user-detail-email:' + user.email,
                JSON.parse(JSON.stringify(userToSave)),
            )
        }
        return user
    }

    existByEmail(email: string): Promise<boolean> {
        return this.userRepository.existByEmail(email)
    }
}
