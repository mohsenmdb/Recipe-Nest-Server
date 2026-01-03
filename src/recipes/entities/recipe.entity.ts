import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('recipe')
export default class Recipe {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    title: string

    @Column({ nullable: false })
    description: string

    @Column({ nullable: false })
    ingredients: string

    @Column({ nullable: true, default: 0 })
    rating: number

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: false })
    user_name: string;

    @Column({ nullable: false })
    user_id: number
}