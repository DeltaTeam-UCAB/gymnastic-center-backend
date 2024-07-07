import { DomainService } from 'src/core/domain/service/domain.service'
import { Subscription } from '../subscription'
import { LessonProgress } from '../value-objects/lesson.progress'
import { LessonID } from '../value-objects/lesson.id'

export const updateLessonProgress: DomainService<
    {
        subscription: Subscription
        time: number
        totalTime: number
        markAsCompleted: boolean
        lesson: LessonID
    },
    Subscription
> = (data) => {
    const lessonProgress = data.markAsCompleted
        ? LessonProgress.createFull()
        : new LessonProgress(Math.floor((data.time * 100) / data.totalTime))
    if (
        data.subscription.lessons.find((e) => e.id == data.lesson)!.progress <
        lessonProgress
    )
        data.subscription.changeLessonProgress(data.lesson, lessonProgress)

    return data.subscription
}
