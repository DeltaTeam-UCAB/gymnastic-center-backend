import { Column, Entity, JoinColumn, ManyToMany, PrimaryColumn } from 'typeorm'
import { Comment } from './comment.entity'
import { User } from 'src/user/infraestructure/models/postgres/user.entity'

@Entity()
export class Like {
    @PrimaryColumn({
        type: 'uuid',
    })
    commentId: string
    @ManyToMany(() => Comment)
    @JoinColumn()
    comment: Comment
    @PrimaryColumn({
        type: 'uuid',
    })
    userId: string
    @ManyToMany(() => User)
    @JoinColumn()
    user: User
    @Column({
        type: 'boolean',
    })
    like: boolean
}
