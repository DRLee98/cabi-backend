import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Cafe } from './cafe.entity';
import { Review } from './review.entity';

@InputType('RatingInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Rating extends CoreEntity {
  @Column()
  @Field((type) => Int)
  @IsInt()
  score: number;

  @OneToOne((type) => Review, (review) => review.rating, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Field((type) => Review)
  review: Review;

  @ManyToOne((type) => Cafe, (cafe) => cafe.ratings, { onDelete: 'CASCADE' })
  @Field((type) => Cafe)
  cafe: Cafe;
}
