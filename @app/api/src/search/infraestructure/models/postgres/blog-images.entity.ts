import { Blog } from './blog.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Image } from './image.entity'

@Entity({ name: 'blog_image' })
export class BlogImage {
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

    @ManyToOne(() => Blog)
    @JoinColumn({
        name: 'blogId',
    })
        post: Blog
}
