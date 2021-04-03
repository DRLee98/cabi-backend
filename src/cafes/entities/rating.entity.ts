import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, Max, Min } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Cafe } from './cafe.entity';
import { Menu } from './menu.entity';
import { Review } from './review.entity';

@InputType('RatingInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Rating extends CoreEntity {
  @Column()
  @Field((type) => Int, {})
  @IsInt()
  @Min(0)
  @Max(5)
  score: number;

  @OneToOne((type) => Review, (review) => review.rating, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Field((type) => Review)
  review: Review;

  @ManyToOne((type) => Cafe, (cafe) => cafe.ratings, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @Field((type) => Cafe, { nullable: true })
  cafe?: Cafe;

  @ManyToOne((type) => Menu, (menu) => menu.ratings, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @Field((type) => Menu, { nullable: true })
  menu?: Menu;
}
