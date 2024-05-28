import { Trainer } from '../../../../../../src/course/application/models/trainer'

export const createTrainer = (data?: {
    id?: string
    name?: string
}): Trainer => ({
    id: data?.id ?? '123456789',
    name: data?.name ?? 'test trainer',
})
