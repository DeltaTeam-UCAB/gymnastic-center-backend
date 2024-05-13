export interface EmailSender<T> {
    send(data: T): Promise<void>
}
