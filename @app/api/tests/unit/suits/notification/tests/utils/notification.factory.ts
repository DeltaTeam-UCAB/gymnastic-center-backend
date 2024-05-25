import { Notification } from '../../../../../../src/notification/application/models/notification'

export const createNotification = (data?: {
    id?: string
    title?: string
    body?: string
    readed?: boolean
    date?: Date
    client?: string
}): Notification => ({
    id: data?.id ?? '1234567890',
    title: data?.title ?? 'test',
    body: data?.body ?? 'test body',
    readed: data?.readed ?? false,
    date: data?.date ?? new Date(),
    client: data?.client ?? '123',
})
