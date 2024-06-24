export type NotificationManagerInput = {
    body: string
    title: string
    to: string
}

export interface NotificationManager {
    notify(data: NotificationManagerInput): void | Promise<void>
}
