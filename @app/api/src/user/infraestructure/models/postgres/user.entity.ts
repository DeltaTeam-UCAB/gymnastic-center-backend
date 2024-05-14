import { UserType, userTypes } from 'src/user/application/models/user'
import { Check, Column, Entity, PrimaryColumn } from 'typeorm'

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
        type: 'boolean',
        default: false,
    })
        verified: boolean
    @Column({
        type: 'varchar',
        nullable: true,
    })
        code: string
}
