import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ChatRoom } from '../entites/chatRoom.entity';

@InputType()
export class CreateChatRoomInput extends PartialType(
  PickType(ChatRoom, ['secret', 'password']),
) {
  @Field((type) => String)
  name: string;
}

@ObjectType()
export class CreateChatRoomOutput extends CoreOutput {
  @Field((type) => Int, { nullable: true })
  id?: number;
}
