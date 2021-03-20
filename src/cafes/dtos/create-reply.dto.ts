import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Reply } from '../entities/reply.entity';

@InputType()
export class CreateReplyInput extends PickType(Reply, ['contents']) {
  @Field((type) => Int)
  reviewId: number;
}

@ObjectType()
export class CreateReplyOutput extends CoreOutput {}
