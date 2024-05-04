import { Client } from 'src/client/infraestructure/models/postgres/client.entity'
import { Column, Entity, JoinColumn, ManyToMany, PrimaryColumn } from 'typeorm'
import { Comment } from './comment.entity'

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
    clientId: string
    @ManyToMany(() => Client)
    @JoinColumn()
    client: Client
    @Column({
        type: 'boolean',
    })
    like: boolean
}
