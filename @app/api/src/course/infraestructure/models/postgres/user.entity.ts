import { Check, Column, Entity, PrimaryColumn } from 'typeorm'

export const userTypes = ['ADMIN', 'CLIENT'] as const

export type UserType = (typeof userTypes)[number]

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
        type: 'enum',
        enum: userTypes,
        default: 'CLIENT',
    })
    type: UserType
    @Column({
        type: 'varchar',
    })
    name: string
    @Column({
        type: 'varchar',
        default: '11111111',
    })
    phone: string
    @Column({
        type: 'varchar',
        nullable: true,
    })
    code: string
    @Column({
        type: 'timestamp',
        nullable: true,
    })
        recoveryTime?: Date
    @Column({
        type: 'varchar',
        nullable: true,
    })
    image?: string
}
