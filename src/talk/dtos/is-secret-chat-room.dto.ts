import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ChatRoom } from '../entites/chatRoom.entity';

@InputType()
export class IsSecretChatRoomInput extends PickType(ChatRoom, ['id']) {}

@ObjectType()
export class IsSecretChatRoomOutput extends CoreOutput {
    @Field((type) => Boolean, {nullable: true})
    isSecret?: boolean;
  }