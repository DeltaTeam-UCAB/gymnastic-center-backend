import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    PrimaryColumn,
} from 'typeorm'
import { User } from './user.entity'
import { Lesson } from './lesson.entity'
import { Blog } from './blog.entity'

@Entity()
export class Comment {
    @PrimaryColumn({
        type: 'uuid',
    })
    id: string
    @Column({
        type: 'uuid',
    })
    userId: string
    @ManyToMany(() => User)
    @JoinColumn()
    user: User
    @Column({
        type: 'uuid',
        nullable: true,
    })
    lessonId: string
    @ManyToMany(() => Lesson)
    @JoinColumn()
    lesson: Lesson
    @Column({
        type: 'uuid',
        nullable: true,
    })
    blogId: string
    @ManyToMany(() => Blog)
    @JoinColumn()
    blog: Blog
    @Column({
        type: 'varchar',
    })
    description: string
    @CreateDateColumn({
        type: 'timestamp',
    })
    creationDate: Date
}
