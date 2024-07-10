import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm'
import { Course } from './course.entity'
import { Video } from './video.entity'
import { Image } from './image.entity'

@Entity()
export class Lesson {
    @PrimaryColumn({
        type: 'uuid',
    })
        id: string
    @Column({
        type: 'varchar',
    })
        title: string
    @Column({
        type: 'varchar',
    })
        content: string
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
        name: 'video',
    })
        videoEntity: Video
    @Column({
        type: 'uuid',
        nullable: false,
    })
        video: string
    @Column({
        type: 'numeric',
    })
        order: number
    @ManyToOne(() => Image, (image) => image.id)
    @JoinColumn({
        name: 'image',
    })
        imageEntity?: Image
    @Column({
        type: 'uuid',
        nullable: true,
    })
        image?: string
    @Column({
        type: 'boolean',
        nullable: true,
        default: true,
    })
        active: boolean
}
