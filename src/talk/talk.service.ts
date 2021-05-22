import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/users/entites/user.entity';
import { Repository } from 'typeorm';
import { CreateChatRoomOutput } from './dtos/create-chat-room.dto';
import {
  ViewChatRoomInput,
  ViewChatRoomOutput,
} from './dtos/view-chat-room.dto';
import { ChatRoom } from './entites/chatRoom.entity';
import { Message } from './entites/message.entity';

@Injectable()
export class TalkService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly commonService: CommonService,
  ) {}

  async createChatRoom(user: User): Promise<CreateChatRoomOutput> {
    try {
      const chatRoom = await this.chatRoomRepository.save(
        this.chatRoomRepository.create({ users: [user] }),
      );
      return {
        ok: true,
        id: chatRoom.id,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async viewChatRoom(
    user: User,
    { id }: ViewChatRoomInput,
  ): Promise<ViewChatRoomOutput> {
    try {
      const chatRoom = await this.chatRoomRepository.findOne({ id });
      return {
        ok: true,
        chatRoom,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }
}
