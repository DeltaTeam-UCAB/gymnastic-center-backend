import { User } from 'src/user/infraestructure/models/postgres/user.entity'
import { Entity, JoinColumn, ManyToMany, PrimaryColumn } from 'typeorm'
import { Trainer } from './trainer.entity'

@Entity()
export class Follow {
    @PrimaryColumn({
        type: 'uuid',
    })
    userId: string
    @ManyToMany(() => User)
    @JoinColumn()
    user: User
    @PrimaryColumn({
        type: 'uuid',
    })
    trainerId: string
    @ManyToMany(() => Trainer)
    @JoinColumn()
    trainer: Trainer
}
