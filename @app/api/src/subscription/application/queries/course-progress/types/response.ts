export type GetCourseProgressResponse = {
    percent: number
    lessons: {
        lessonId: string
        time?: number
        percent: number
    }[]
}
