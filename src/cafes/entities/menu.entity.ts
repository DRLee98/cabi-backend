import {
  Field,
  Float,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Cafe } from './cafe.entity';
import { Nutrient } from './nutrient.entity';
import { Rating } from './rating.entity';
import { Review } from './review.entity';

@InputType('OptionInputType', { isAbstract: true })
@ObjectType()
export class Option {
  @Field((type) => String)
  name: string;

  @Field((type) => Int, { nullable: true })
  price?: number;

  @Field((type) => [OptionItem], { nullable: true })
  optionItems?: OptionItem[];
}

@InputType('OptionItemInputType', { isAbstract: true })
@ObjectType()
export class OptionItem {
  @Field((type) => String)
  name: string;

  @Field((type) => Int, { nullable: true })
  price?: number;
}

enum Category {
  Beverage = 'Beverage',
  Dessert = 'Dessert',
  Bread = 'Bread',
  Meal = 'Meal',
  Goods = 'Goods',
  Etc = 'Etc',
}

registerEnumType(Category, { name: 'Category' });

@InputType('MenuInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Menu extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  name: string;

  @Column()
  @Field((type) => String)
  @IsString()
  description: string;

  @Column()
  @Field((type) => Int)
  @IsInt()
  price: number;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  menuImg?: string;

  @Column({ type: 'enum', enum: Category })
  @Field((type) => Category)
  @IsEnum(Category)
  category: Category;

  @ManyToOne((type) => Cafe, (cafe) => cafe.menus, { onDelete: 'CASCADE' })
  @Field((type) => Cafe)
  cafe: Cafe;

  @OneToOne((type) => Nutrient, (nutrient) => nutrient.menu, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Field((type) => Nutrient, { nullable: true })
  nutrient?: Nutrient;

  @Column({ type: 'json', nullable: true })
  @Field((type) => [Option], { nullable: true })
  options?: Option[];

  @OneToMany((type) => Review, (review) => review.menu, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field((type) => [Review], { nullable: true })
  reviews?: Review[];

  @OneToMany((type) => Rating, (rating) => rating.menu, {
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
