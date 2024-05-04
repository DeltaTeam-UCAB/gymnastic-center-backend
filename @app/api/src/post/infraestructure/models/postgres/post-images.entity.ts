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

    @Column({
        type: 'uuid',
    })
    imageId: string

    @PrimaryColumn({
        type: 'uuid',
    })
    id: string

    @ManyToOne(() => Image, (image) => image.id)
    @JoinColumn({
        name: 'imageId',
    })
    image: Image

    @OneToOne(() => Posts)
    @JoinColumn({
        name: 'postId',
    })
    post: Posts
}
