import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from '../../common/entites/core.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Address } from '../../common/entites/address.entity';
import { IsNumber, IsString } from 'class-validator';
import { User } from '../../users/entites/user.entity';
import { Keyword } from './keyword.entity';
import { Review } from './review.entity';
import { Rating } from './rating.entity';
import { Menu } from './menu.entity';

@InputType('CafeInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Cafe extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  name: string;

  @Column()
  @Field((type) => String)
  @IsString()
  description: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  coverImg?: string;

  @OneToOne((type) => Address, (address) => address.cafe, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @Field((type) => Address)
  address: Address;

  @ManyToMany((type) => Keyword, (keyword) => keyword.cafes, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinTable()
  @Field((type) => [Keyword], { nullable: true })
  keywords?: Keyword[];

  @ManyToOne((type) => User, (user) => user.cafes, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @Field((type) => User)
  owner: User;

  @ManyToMany((type) => User, (user) => user.likeCafes, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field((type) => [User], { nullable: true })
  likedUsers?: User[];

  @OneToMany((type) => Menu, (menu) => menu.cafe, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field((type) => [Menu], { nullable: true })
  menus?: Menu[];

  @OneToMany((type) => Review, (review) => review.cafe, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field((type) => [Review], { nullable: true })
  reviews?: Review[];

  @OneToMany((type) => Rating, (rating) => rating.cafe, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @Field((type) => [Rating], { nullable: true })
  ratings?: Rating[];

  @Column({ default: 0 })
  @Field((type) => Int)
  @IsNumber()
  totalScore: number;

  @Column({ type: 'float', default: 0 })
  @Field((type) => Float)
  @IsNumber()
  avgScore: number;
}
