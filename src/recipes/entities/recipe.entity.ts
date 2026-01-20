import User from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

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

    @ManyToOne(() => User, user => user.recipes, {
        nullable: false,
        eager: true // Optional: if you want user data always loaded
    })
    @JoinColumn({ name: 'user' }) // Specify column name
    user: User;
}
