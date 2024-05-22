import { Lesson } from 'src/course/infraestructure/models/postgres/lesson.entity'
import { Posts } from 'src/post/infraestructure/models/postgres/post.entity'
import { User } from 'src/user/infraestructure/models/postgres/user.entity'
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
    postId: string
    @ManyToMany(() => Posts)
    @JoinColumn()
    post: Posts
    @Column({
        type: 'varchar',
    })
    description: string
    @CreateDateColumn({
        type: 'date',
    })
    creationDate: Date
}
