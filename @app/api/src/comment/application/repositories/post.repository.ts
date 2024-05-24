export interface PostRepository {
    existsById(id: string): Promise<boolean>
}
