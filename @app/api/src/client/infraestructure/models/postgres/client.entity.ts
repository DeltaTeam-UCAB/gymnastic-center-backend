import { User } from 'src/user/infraestructure/models/postgres/user.entity'
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
export type ClientGenders = 'F' | 'M' | 'X'

@Entity()
export class Client {
    
    @PrimaryColumn({
        type:'uuid'
    })
    userId:string
    @OneToOne(() => User)
    @JoinColumn()
    user:User;
    @Column({
        type: 'int',
        nullable: true,
    })
    weight: number
    @Column({
        type: 'int',
        nullable: true,
    })
    height: number
    @Column({
        type: 'varchar',
        nullable: true,
    })
    location: string
    @Column({
        type: 'varchar',
        nullable: true,
    })
    gender: 'F' | 'M' | 'X'
    @Column({
        type: 'date',
        nullable: true,
    })
    birthdate: Date;
}
