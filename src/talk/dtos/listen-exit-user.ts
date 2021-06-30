import { InputType, PickType } from '@nestjs/graphql';
import { ChatRoom } from '../entites/chatRoom.entity';

@InputType()
export class ListenExitUserInput extends PickType(ChatRoom, ['id']) {}
