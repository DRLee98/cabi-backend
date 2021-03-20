import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/users/entites/user.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Cafe } from './cafe.entity';
import { Menu } from './menu.entity';
import { Rating } from './rating.entity';
import { Reply } from './reply.entity';

@InputType('ReviewInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Review extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  contents: string;

  @OneToOne((type) => Rating, (rating) => rating.review, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @Field((type) => Rating, { nullable: true })
  rating?: Rating;

  @ManyToOne((type) => User, (user) => user.review, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Field((type) => User)
  writer: User;

  @OneToMany((type) => Reply, (reply) => reply.review, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field((type) => [Reply], { nullable: true })
  reply?: Reply[];

  @ManyToOne((type) => Cafe, (cafe) => cafe.reviews, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @Field((type) => Cafe, { nullable: true })
  cafe?: Cafe;

  @ManyToOne((type) => Menu, (menu) => menu.reviews, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @Field((type) => Menu, { nullable: true })
  menu?: Menu;
}
