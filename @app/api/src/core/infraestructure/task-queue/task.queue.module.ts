import { AsyncLimiterTaskQueue } from './service/async.limiter.task.queue'
import { ServiceModule } from '../decorators/service.module'

export const NATIVE_TASK_QUEUE = 'NATIVE_TASK_QUEUE'

@ServiceModule([
    {
        provide: NATIVE_TASK_QUEUE,
        useClass: AsyncLimiterTaskQueue,
    },
])
export class TaskQueueModule {}
