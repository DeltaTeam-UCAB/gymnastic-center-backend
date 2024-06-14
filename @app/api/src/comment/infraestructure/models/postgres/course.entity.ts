import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm'
import { Image } from './image.entity'
import { Category } from './category.entity'
import { Trainer } from './trainer.entity'

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
    level: string
    @CreateDateColumn({
        type: 'date',
    })
    date: Date
    @Column({
        type: 'varchar',
    })
    category: string
    @ManyToOne(() => Category, (category) => category.id)
    @JoinColumn({
        name: 'category',
    })
    categoryEntity: Category
    @ManyToOne(() => Image, (image) => image.id)
    @JoinColumn({
        name: 'image',
    })
    imageEntity: Image
    @ManyToOne(() => Trainer, (trainer) => trainer.id)
    @JoinColumn({
        name: 'trainer',
    })
    trainerEnt: Trainer
    @Column({
        type: 'uuid',
    })
        trainer: string
    @Column({
        type: 'uuid',
    })
    image: string
}
