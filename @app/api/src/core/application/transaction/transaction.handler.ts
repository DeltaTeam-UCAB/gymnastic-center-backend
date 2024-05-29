export interface TransactionHandler {
    commit(): Promise<void>
    cancel(): Promise<void>
}
