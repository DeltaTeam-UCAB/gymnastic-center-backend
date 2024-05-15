import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Video {
    @PrimaryColumn({
        type: 'uuid',
    })
    id: string
    @Column({
        type: 'varchar',
    })
    src: string
}
