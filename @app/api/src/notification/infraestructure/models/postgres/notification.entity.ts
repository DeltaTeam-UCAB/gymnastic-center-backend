import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Notification {
    @PrimaryColumn({
        type: 'uuid',
    })
        id: string
    @Column({
        type: 'varchar',
    })
        title: string
    @Column({
        type: 'varchar',
    })
        body: string
    @Column({
        type: 'uuid',
    })
        client: string
    @Column({
        type: 'timestamp',
    })
        date: Date
    @Column({
        type: 'boolean',
        default: false,
    })
        readed: boolean
    @ManyToOne(() => User, (user) => user.id)
        clientRecord: User
}
