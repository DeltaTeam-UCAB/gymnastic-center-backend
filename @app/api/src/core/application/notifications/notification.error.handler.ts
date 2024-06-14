export interface NotificationErrorHandler<T> {
    publish(data: T, error: Error): Promise<void>
}
