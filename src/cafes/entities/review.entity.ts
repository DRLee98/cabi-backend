import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/users/entites/user.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Cafe } from './cafe.entity';
import { Rating } from './rating.entity';

@InputType('ReviewInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Review extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  contents: string;

  @OneToOne((type) => Rating, (rating) => rating.review, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @Field((type) => Rating, { nullable: true })
  rating?: Rating;

  @ManyToOne((type) => User, (user) => user.review, { onDelete: 'CASCADE' })
  @Field((type) => User)
  writer: User;

  @ManyToOne((type) => Cafe, (cafe) => cafe.reviews, { onDelete: 'CASCADE' })
  @Field((type) => Cafe)
  cafe: Cafe;
}
