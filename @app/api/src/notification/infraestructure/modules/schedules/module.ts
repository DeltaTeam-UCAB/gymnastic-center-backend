import { SchedulesModule } from 'src/core/infraestructure/schedules/decorators/schedule.module.decorator'

@(await SchedulesModule())
export class NotificationSchedule {}
