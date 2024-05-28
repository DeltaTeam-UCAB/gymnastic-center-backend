import { Image } from 'src/image/infraestructure/models/postgres/image.entity'
import { Posts } from './post.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

@Entity({ name: 'post_image' })
export class PostImages {
    @Column({
        type: 'uuid',
    })
        blogId: string

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

    @ManyToOne(() => Posts)
    @JoinColumn({
        name: 'postId',
    })
        post: Posts
}
