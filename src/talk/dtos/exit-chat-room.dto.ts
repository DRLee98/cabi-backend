import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ChatRoom } from '../entites/chatRoom.entity';

@InputType()
export class ExitChatRoomInput extends PickType(ChatRoom, ['id']) {}

@ObjectType()
export class ExitChatRoomOutput extends CoreOutput {}
