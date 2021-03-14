import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsInt, IsString } from 'class-validator';
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

enum Category {
  Beverage = 'Beverage',
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
  /*
  @OneToMany((type) => Option, (option) => option.menu, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field((type) => [Option], { nullable: true })
  options?: Option[];
  */
}
