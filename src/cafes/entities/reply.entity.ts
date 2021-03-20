import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/users/entites/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Review } from './review.entity';

@InputType('ReplyInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Reply extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  contents: string;

  @ManyToOne((type) => Review, (review) => review.reply, {
    onDelete: 'CASCADE',
  })
  @Field((type) => Review)
  review: Review;

  @ManyToOne((type) => User, (user) => user.reply, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Field((type) => User)
  writer: User;
}
