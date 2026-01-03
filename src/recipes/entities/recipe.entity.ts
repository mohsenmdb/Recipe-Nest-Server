import User from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('recipe')
export default class Recipe {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    title: string

    @Column({ length: 10, nullable: false })
    description: string

    @Column({ nullable: false })
    ingredients: string

    // @Column({ nullable: true })
    // rating: number

    // @CreateDateColumn()
    // createdAt: Date;

    // @UpdateDateColumn()
    // updatedAt: Date;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: false })
    user_name: string
}