export interface LessonRepository {
    existsById(id: string): Promise<boolean>
}
