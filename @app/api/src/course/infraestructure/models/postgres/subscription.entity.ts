import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Course } from './course.entity'
import { User } from './user.entity'

@Entity()
export class Subscription {
    @PrimaryColumn({
        type: 'uuid',
    })
        id: string
    @Column({
        type: 'uuid',
    })
        course: string
    @Column({
        type: 'uuid',
    })
        client: string
    @Column({
        type: 'timestamp',
    })
        startDate: Date
    @Column({
        type: 'timestamp',
    })
    endDate: Date
    @ManyToOne(() => Course, (course) => course.id)
    @JoinColumn({
        name: 'course',
    })
        courseEntity: Course
    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({
        name: 'client',
    })
    clientEntity: User
}
