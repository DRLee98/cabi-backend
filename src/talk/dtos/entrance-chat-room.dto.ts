import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ChatRoom } from '../entites/chatRoom.entity';

@InputType()
export class EntranceChatRoomInput extends PickType(ChatRoom, ['id']) {
  @Field((type) => String, { nullable: true })
  password?: string;
}

@ObjectType()
export class EntranceChatRoomOutput extends CoreOutput {
  @Field((type) => Int, { nullable: true })
  id?: number;
}
