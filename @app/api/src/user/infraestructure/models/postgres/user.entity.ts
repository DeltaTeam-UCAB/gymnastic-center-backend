import { Check, Column, Entity, PrimaryColumn } from 'typeorm'

export type UserRoles = 'CLIENT' | 'ADMIN'

@Entity()
@Check('"email" ~* \'^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$\'')
export class User {
    @PrimaryColumn({
        type: 'uuid',
    })
    id: string
    @Column({
        type: 'varchar',
        unique: true,
    })
    email: string
    @Column({
        type: 'varchar',
    })
    password: string
    @Column({
        type: 'varchar',
        enum: ['CLIENT', 'ADMIN'],
    })
    type: 'CLIENT' | 'ADMIN'
    @Column({
        type: 'varchar',
    })
    name: string
}
