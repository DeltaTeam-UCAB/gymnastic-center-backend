import { Column, Entity, PrimaryColumn } from 'typeorm'

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
        type: 'boolean',
        default: true,
        nullable: true,
    })
    active: boolean
}
