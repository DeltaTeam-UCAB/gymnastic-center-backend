import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Posts {
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
        body: string

    @Column('varchar', {
        array: true,
        default: [],
    })
    tags: string[]

    @Column({
        type: 'varchar',
    })
    trainer: string

    @Column({
        type: 'varchar',
    })
    category: string

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    date: Date
}
