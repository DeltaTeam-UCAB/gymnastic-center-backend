import { Image } from 'src/image/infraestructure/models/postgres/image.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

@Entity()
export class Category {
    @PrimaryColumn({
        type: 'uuid',
    })
    id: string
    @Column({
        type: 'varchar',
        unique: true,
    })
    name: string
    @Column({
        type: 'uuid',
    })
    icon: string
    @ManyToOne(() => Image, (image) => image.id)
    @JoinColumn({
        name: 'icon',
    })
    iconRes: Image
}
