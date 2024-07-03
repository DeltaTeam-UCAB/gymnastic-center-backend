import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Subscription } from './subscription.entity'
import { Lesson } from './lesson.entity'

@Entity()
export class SubscriptionLesson {
    @PrimaryColumn({
        type: 'uuid',
    })
    subscription: string
    @PrimaryColumn({
        type: 'uuid',
    })
    lesson: string
    @Column({
        type: 'int',
    })
    progress: number
    @Column({
        type: 'int',
        nullable: true,
    })
    lastTime?: number
    @ManyToOne(() => Subscription, (subs) => subs.id)
    @JoinColumn({
        name: 'subscription',
    })
    subscriptionEntity: Subscription
    @ManyToOne(() => Lesson, (lesson) => lesson.id)
    @JoinColumn({
        name: 'lesson',
    })
    lessonEntity: Lesson
}
