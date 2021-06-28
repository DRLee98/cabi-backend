import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ChatRoom } from '../entites/chatRoom.entity';

@ObjectType()
export class ViewChatRoomsOutput extends CoreOutput {
  @Field((type) => [ChatRoom], { nullable: true })
  chatRooms?: ChatRoom[];
}
