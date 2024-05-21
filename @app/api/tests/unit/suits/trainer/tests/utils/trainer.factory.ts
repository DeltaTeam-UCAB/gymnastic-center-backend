import { Trainer } from '../../../../../../src/trainer/application/models/trainer'

export const createTrainer = (data?: {
    id?: string
    name?: string
    location?: string
    followers?: string[]
}): Trainer => ({
    id: data?.id ?? '1234567890',
    name: data?.name ?? 'test trainer',
    location: data?.location ?? 'test location',
    followers: data?.followers ?? [],
})
