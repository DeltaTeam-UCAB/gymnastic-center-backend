import { Client } from 'src/client/infraestructure/models/postgres/client.entity'
import { Course } from 'src/course/infraestructure/models/postgres/course.entity'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'

@Entity()
export class Comment {
    @PrimaryColumn({
        type: 'uuid',
    })
    id: string
    @Column({
        type: 'uuid',
    })
    clientId: string
    @ManyToMany(() => Client)
    @JoinColumn()
    client: Client
    @Column({
        type: 'uuid',
        nullable: true
    })
    courseId: string
    @ManyToMany(() => Course)
    @JoinColumn()
    course: Course
    @Column({
        type: 'uuid',
        nullable: true
    })
    postId: string
    @Column({
        type: 'varchar',
    })
    description: string
    @CreateDateColumn({
        type: 'date',
    })
    creationDate: Date
}
