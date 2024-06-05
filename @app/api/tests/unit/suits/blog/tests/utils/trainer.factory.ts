import { Trainer } from '../../../../../../src/blog/application/models/trainer'

export const createTrainer = (data?: {
    id?: string
    name?: string
}): Trainer => ({
    id: data?.id ?? '1234567890',
    name: data?.name ?? 'test trainer',
})
