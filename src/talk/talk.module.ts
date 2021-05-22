import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { ChatRoom } from './entites/chatRoom.entity';
import { Message } from './entites/message.entity';
import { ChatRoomResolver, MessageResolver } from './talk.resolver';
import { TalkService } from './talk.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Message])],
  providers: [ChatRoomResolver, MessageResolver, TalkService, CommonService],
})
export class TalkModule {}
