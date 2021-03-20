import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Review } from '../entities/review.entity';

@InputType()
export class CreateCafeReviewInput extends PickType(Review, ['contents']) {
  @Field((type) => Int)
  score: number;

  @Field((type) => Int)
  cafeId: number;
}

@ObjectType()
export class CreateCafeReviewOutput extends CoreOutput {}
