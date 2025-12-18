import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export default class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true, nullable: false})
    email: string

    @Column({length: 25, nullable: true})
    firs_name: string

    @Column({length: 25, nullable: true})
    last_name: string

    @Column({nullable: true})
    age: number

    @Column({select: false, nullable: false})
    password: string
}

