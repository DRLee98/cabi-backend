import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entites/user.entity';
import { CreateChatRoomOutput } from './dtos/create-chat-room.dto';
import {
  ViewChatRoomInput,
  ViewChatRoomOutput,
} from './dtos/view-chat-room.dto';
import { ChatRoom } from './entites/chatRoom.entity';
import { Message } from './entites/message.entity';
import { TalkService } from './talk.service';

@Resolver((of) => ChatRoom)
export class ChatRoomResolver {
  constructor(private readonly talkService: TalkService) {}

  @Role(['Any'])
  @Mutation((returns) => CreateChatRoomOutput)
  createChatRoom(@AuthUser() user: User): Promise<CreateChatRoomOutput> {
    return this.talkService.createChatRoom(user);
  }

  @Role(['Any'])
  @Query((returns) => ViewChatRoomOutput)
  viewChatRoom(
    @AuthUser() user: User,
    @Args('input') viewChatRoomInput: ViewChatRoomInput,
  ): Promise<ViewChatRoomOutput> {
    return this.talkService.viewChatRoom(user, viewChatRoomInput);
  }
}

@Resolver((of) => Message)
export class MessageResolver {
  constructor(private readonly talkService: TalkService) {}
}
