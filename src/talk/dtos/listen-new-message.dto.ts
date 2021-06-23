import { InputType, PickType } from '@nestjs/graphql';
import { ChatRoom } from '../entites/chatRoom.entity';

@InputType()
export class ListenNewMessageInput extends PickType(ChatRoom, ['id']) {}
