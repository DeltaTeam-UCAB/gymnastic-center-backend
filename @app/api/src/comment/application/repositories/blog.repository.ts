export interface BlogRepository {
    existsById(id: string): Promise<boolean>
}
