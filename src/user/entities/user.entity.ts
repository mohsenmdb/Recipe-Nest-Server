import Recipe from "src/recipes/entities/recipe.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity('user')
export default class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, nullable: false })
    email: string

    @Column({ length: 25, nullable: true })
    first_name: string

    @Column({ length: 25, nullable: true })
    last_name: string

    @Column({ nullable: true })
    age: number

    @Column({ select: false, nullable: false })
    password: string

    @OneToMany(() => Recipe, recipe => recipe.user)
    recipes: Recipe[];
}

