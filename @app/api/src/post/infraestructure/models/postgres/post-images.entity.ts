import { Posts } from './post.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm'


@Entity({ name: 'post_image' })
export class PostImages {

    @Column({
        type: 'uuid',
    })
    postId: string;

    @PrimaryColumn({
        type: 'uuid'
    })
    id: string;

    @Column({
        type: 'varchar',
    })
    url: string;

    @ManyToOne(
        () => Posts,
    )
    @JoinColumn({
        name: 'postId'
    })
    post: Posts;
}
