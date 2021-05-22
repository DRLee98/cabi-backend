import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ChatRoom } from '../entites/chatRoom.entity';

@InputType()
export class ViewChatRoomInput extends PickType(ChatRoom, ['id']) {}

@ObjectType()
export class ViewChatRoomOutput extends CoreOutput {
  @Field((type) => ChatRoom)
  chatRoom?: ChatRoom;
}
