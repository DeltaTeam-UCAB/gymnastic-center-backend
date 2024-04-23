export interface TaskQueue {
    add(task: () => void | Promise<void>): void
}
