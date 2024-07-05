import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Trainer } from './trainer.entity'
import { Category } from './category.entity'

@Entity()
export class Blog {
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

    @ManyToOne(() => Trainer, (trainer) => trainer.id)
    @JoinColumn({
        name: 'trainer',
    })
    trainerEnt: Trainer

    @Column({
        type: 'varchar',
    })
    trainer: string

    @ManyToOne(() => Category, (category) => category.id)
    @JoinColumn({
        name: 'category',
    })
    categoryEntity: Category

    @Column({
        type: 'varchar',
    })
    category: string

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    date: Date

    @Column({
        type: 'boolean',
        default: true,
    })
    active: boolean
}
