import { Lesson } from 'src/comment/infraestructure/models/postgres/lesson.entity'
import { Blog } from 'src/comment/infraestructure/models/postgres/blog.entity'
import { User } from 'src/comment/infraestructure/models/postgres/user.entity'
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    PrimaryColumn,
} from 'typeorm'

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
        type: 'date',
    })
    creationDate: Date
}
