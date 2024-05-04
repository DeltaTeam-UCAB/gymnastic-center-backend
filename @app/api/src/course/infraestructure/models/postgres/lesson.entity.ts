import { Video } from 'src/video/infraestructure/models/postgres/video'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

@Entity()
export class Lesson {
    @PrimaryColumn({
        type: 'uuid',
    })
    id: string
    @Column({
        type: 'varchar',
    })
    name: string
    @Column({
        type: 'varchar',
    })
    description: string
    @ManyToOne(() => Video, (video) => video.id)
    @JoinColumn()
    video: string
    @Column({
        type: 'numeric',
    })
    order: number
    @Column({
        type: 'numeric',
    })
    waitTime?: number | null
    @Column({
        type: 'numeric',
    })
    burnedCalories: number
}
