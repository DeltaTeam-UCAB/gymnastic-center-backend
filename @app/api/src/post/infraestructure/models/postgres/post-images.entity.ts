import { Image } from 'src/image/infraestructure/models/postgres/image'
import { Posts } from './post.entity'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
} from 'typeorm'

@Entity({ name: 'post_image' })
export class PostImages {
    @Column({
        type: 'uuid',
    })
    postId: string

    @PrimaryColumn({
        type: 'uuid',
    })
    id: string

    @Column({
        type: 'varchar',
    })
    url: string

    @OneToOne(() => Image, (image) => image.id)
    @ManyToOne(() => Posts)
    @JoinColumn({
        name: 'postId',
    })
    post: Posts
}
