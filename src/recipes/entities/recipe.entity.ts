import User from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { Expose, Transform } from 'class-transformer';

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

    @Column({ 
        type: 'bigint',
        nullable: false,
        default: () => 'EXTRACT(EPOCH FROM NOW())::bigint'
    })
    createdAt: number;

    @Column({ 
        type: 'bigint',
        nullable: false,
        default: () => 'EXTRACT(EPOCH FROM NOW())::bigint'
    })
    updatedAt: number;

    @BeforeInsert()
    setTimestampsOnInsert() {
        const timestamp = Math.floor(Date.now() / 1000);
        this.createdAt = timestamp;
        this.updatedAt = timestamp;
    }

    @BeforeUpdate()
    setTimestampOnUpdate() {
        this.updatedAt = Math.floor(Date.now() / 1000);
    }

    @Column({ nullable: true })
    image: string;

    @ManyToOne(() => User, user => user.recipes, {
        nullable: false,
        eager: true // Optional: if you want user data always loaded
    })
    @JoinColumn({ name: 'user' }) // Specify column name
    user: User;
}
