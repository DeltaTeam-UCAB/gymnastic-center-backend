import { Image } from 'src/image/infraestructure/models/postgres/image'
import { Video } from 'src/video/infraestructure/models/postgres/video'
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
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
    @OneToOne(() => Video, (video) => video.id)
    @JoinColumn()
    @Column({
        nullable: true,
        type: 'varchar',
    })
    video?: string | null
    @OneToOne(() => Image, (image) => image.id)
    @JoinColumn()
    @Column({
        nullable: true,
        type: 'varchar',
    })
    image: string
    // tags:  Lista de tags para el curso, falta crear clase tags.
}
