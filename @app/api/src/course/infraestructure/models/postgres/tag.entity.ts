import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Tag {
    @PrimaryColumn({
        type: 'uuid',
    })
        id: string
    @Column({
        type: 'varchar',
        unique: true,
    })
        name: string
}
