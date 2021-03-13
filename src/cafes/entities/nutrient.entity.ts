import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Menu } from './menu.entity';

@InputType('NutrientInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Nutrient extends CoreEntity {
  @Column()
  @Field((type) => Int)
  @IsInt()
  volume: number;

  @Column()
  @Field((type) => Int)
  @IsInt()
  calorie: number;

  @Column()
  @Field((type) => Int)
  @IsInt()
  salt: number;

  @Column()
  @Field((type) => Int)
  @IsInt()
  carbohydrate: number;

  @Column()
  @Field((type) => Int)
  @IsInt()
  sugars: number;

  @Column()
  @Field((type) => Int)
  @IsInt()
  fat: number;

  @Column()
  @Field((type) => Int)
  @IsInt()
  transFat: number;

  @Column()
  @Field((type) => Int)
  @IsInt()
  saturatedFat: number;

  @Column()
  @Field((type) => Int)
  @IsInt()
  cholesterol: number;

  @Column()
  @Field((type) => Int)
  @IsInt()
  protein: number;

  @OneToOne((type) => Menu, (menu) => menu.nutrient, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field((type) => Menu)
  menu: Menu;
}
