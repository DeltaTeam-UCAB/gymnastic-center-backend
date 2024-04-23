import { Injectable } from '@nestjs/common'
import { TaskQueue } from 'src/core/application/task-queue/task.queue'
import Limiter from 'async-limiter'

@Injectable()
export class AsyncLimiterTaskQueue implements TaskQueue {
    private readonly queue = new Limiter({ concurrency: 1 })
    add(task: () => void | Promise<void>): void {
        this.queue.push(async (cb: () => void) => {
            await task()
            cb()
        })
    }
}
