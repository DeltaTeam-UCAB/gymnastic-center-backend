import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Course } from './course.entity'
import { Tag } from './tag.entity'

@Entity()
export class CourseTag {
    @PrimaryColumn({
        type: 'uuid',
    })
    courseId: string
    @PrimaryColumn({
        type: 'uuid',
    })
    tagId: string
    @ManyToOne(() => Course, (course) => course.id)
    @JoinColumn({
        name: 'courseId',
    })
    course: Course
    @ManyToOne(() => Tag, (tag) => tag.id)
    @JoinColumn({
        name: 'tagId',
    })
    tag: Tag
}
