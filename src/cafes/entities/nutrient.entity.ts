import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Menu } from './menu.entity';

@InputType('NutrientInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Nutrient extends CoreEntity {
  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  @IsInt()
  volume?: number;

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  @IsInt()
  calorie?: number;

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  @IsInt()
  salt?: number;

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  @IsInt()
  carbohydrate?: number;

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  @IsInt()
  sugars?: number;

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  @IsInt()
  fat?: number;

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  @IsInt()
  transFat?: number;

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  @IsInt()
  saturatedFat?: number;

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  @IsInt()
  cholesterol?: number;

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  @IsInt()
  protein?: number;

  @OneToOne((type) => Menu, (menu) => menu.nutrient, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Field((type) => Menu)
  menu?: Menu;
}
