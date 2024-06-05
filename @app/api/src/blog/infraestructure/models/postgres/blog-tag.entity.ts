import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Blog } from './blog.entity'
import { Tag } from './tag.entity'

@Entity()
export class BlogTag {
    @PrimaryColumn({
        type: 'uuid',
    })
    blogId: string
    @PrimaryColumn({
        type: 'uuid',
    })
    tagId: string
    @ManyToOne(() => Blog, (blog) => blog.id)
    @JoinColumn({
        name: 'blogId',
    })
    blog: Blog
    @ManyToOne(() => Tag, (tag) => tag.id)
    @JoinColumn({
        name: 'tagId',
    })
    tag: Tag
}
