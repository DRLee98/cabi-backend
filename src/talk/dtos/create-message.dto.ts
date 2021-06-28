import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Message } from '../entites/message.entity';

@InputType()
export class CreateMessageInput extends PickType(Message, ['context']) {
  @Field((type) => Int)
  chatRoomId: number;
}

@ObjectType()
export class CreateMessageOutput extends CoreOutput {
  @Field((type) => Int, { nullable: true })
  id?: number;
}
