import { User } from 'src/user/infraestructure/models/postgres/user.entity'
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'

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
