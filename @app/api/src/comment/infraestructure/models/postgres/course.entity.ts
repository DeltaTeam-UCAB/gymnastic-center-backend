import { Image } from 'src/comment/infraestructure/models/postgres/image.entity'
import { Video } from 'src/comment/infraestructure/models/postgres/video.entity'
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Course {
    @PrimaryColumn({
        type: 'uuid',
    })
    id: string
    @Column({
        type: 'varchar',
        unique: true,
    })
    title: string
    @Column({
        type: 'varchar',
    })
    description: string
    @Column({
        type: 'varchar',
    })
    instructor: string
    @Column({
        type: 'numeric',
    })
    calories: number
    @CreateDateColumn({
        type: 'date',
    })
    creationDate: Date
    @UpdateDateColumn({
        type: 'date',
    })
    updateDate: Date
    @Column({
        type: 'varchar',
    })
    category: string
    @ManyToOne(() => Video, (video) => video.id)
    @JoinColumn()
    video?: Video
    @Column({
        type: 'uuid',
        nullable: true,
    })
    videoId?: string
    @ManyToOne(() => Image, (image) => image.id)
    @JoinColumn({
        name: 'imageId',
    })
    image: Image
    @Column({
        type: 'uuid',
    })
    imageId: string
    // tags:  Lista de tags para el curso, falta crear clase tags.
}
