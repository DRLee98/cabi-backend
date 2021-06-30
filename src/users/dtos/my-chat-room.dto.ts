import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ChatRoom } from 'src/talk/entites/chatRoom.entity';

@ObjectType()
export class MyChatRoomOutput extends CoreOutput {
  @Field((type) => [ChatRoom], { nullable: true })
  chatRooms?: ChatRoom[];
}
