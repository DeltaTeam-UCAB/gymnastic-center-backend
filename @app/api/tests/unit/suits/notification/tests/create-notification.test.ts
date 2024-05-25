import { NotificationRepositoryMock } from './utils/notification.repository.mock'
import { CreateNotificationCommand } from '../../../../../src/notification/application/commands/create/create.notification.command'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { DateProviderMock } from './utils/date.provider.mock'

export const name = 'Should create notification'
export const body = async () => {
    const notificationRepository = new NotificationRepositoryMock()
    const date = new Date()
    const result = await new CreateNotificationCommand(
        new IDGeneratorMock('123'),
        notificationRepository,
        new DateProviderMock(date),
    ).execute({
        client: '123',
        title: 'test',
        body: 'test body',
    })
    lookFor(result.isError()).equals(false)
    lookFor(await notificationRepository.getById('123')).toDeepEqual({
        client: '123',
        title: 'test',
        body: 'test body',
        readed: false,
        date,
        id: '123',
    })
}
