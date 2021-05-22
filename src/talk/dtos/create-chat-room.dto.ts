import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@ObjectType()
export class CreateChatRoomOutput extends CoreOutput {
  @Field((type) => Int, { nullable: true })
  id?: number;
}
