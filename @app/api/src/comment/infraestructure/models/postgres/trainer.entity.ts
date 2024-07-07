import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Image } from './image.entity'

@Entity()
export class Trainer {
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
    location: string
    @Column({
        type: 'uuid',
    })
        image: string
    @Column({
        type: 'boolean',
        default: true,
        nullable: true,
    })
    active: boolean
    @ManyToOne(() => Image, (image) => image.id)
    @JoinColumn({
        name: 'image',
    })
    imageEntity: Image
}
