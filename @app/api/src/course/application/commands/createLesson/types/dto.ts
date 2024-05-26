export type CreateLessonDTO = {
    name: string
    description: string
    courseId: string
    videoId: string
    order: number
    waitTime?: number
    burnedCalories: number
}