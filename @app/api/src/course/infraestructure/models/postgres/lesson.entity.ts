import { Video } from 'src/video/infraestructure/models/postgres/video'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm'
import { Course } from './course.entity'

@Entity()
export class Lesson {
    @PrimaryColumn({
        type: 'uuid',
    })
    id: string
    @Column({
        type: 'varchar',
    })
    name: string
    @Column({
        type: 'varchar',
    })
    description: string
    @ManyToOne(() => Course, (course) => course.id)
    @JoinColumn({
        name: 'courseId',
    })
    course: Course

    @Column({
        type: 'uuid',
    })
    courseId: string

    @OneToMany(() => Video, (video) => video.id)
    @JoinColumn({
        name: 'videoId',
    })
    video: Video
    @Column({
        type: 'uuid',
    })
    videoId: string
    @Column({
        type: 'numeric',
    })
    order: number
    @Column({
        type: 'numeric',
    })
    waitTime?: number | null
    @Column({
        type: 'numeric',
    })
    burnedCalories: number
}
