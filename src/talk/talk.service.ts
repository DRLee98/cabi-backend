import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'apollo-server-express';
import { NEW_MESSAGE, PUB_SUB } from 'src/common/common.constants';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/users/entites/user.entity';
import { Equal, Repository } from 'typeorm';
import {
  CreateChatRoomInput,
  CreateChatRoomOutput,
} from './dtos/create-chat-room.dto';
import {
  CreateMessageInput,
  CreateMessageOutput,
} from './dtos/create-message.dto';
import {
  EntranceChatRoomInput,
  EntranceChatRoomOutput,
} from './dtos/entrance-chat-room.dto';
import {
  ExitChatRoomInput,
  ExitChatRoomOutput,
} from './dtos/exit-chat-room.dto';
import {
  IsSecretChatRoomInput,
  IsSecretChatRoomOutput,
} from './dtos/is-secret-chat-room.dto';
import {
  ViewChatRoomInput,
  ViewChatRoomOutput,
} from './dtos/view-chat-room.dto';
import { ViewChatRoomsOutput } from './dtos/view-chat-rooms.dto';
import { ChatRoom } from './entites/chatRoom.entity';
import { Message, MessageType } from './entites/message.entity';

@Injectable()
export class TalkService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly commonService: CommonService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  isEntrance(chatRoom: ChatRoom, user: User): boolean {
    return (
      chatRoom.users.filter((chatUser) => chatUser.id === user.id).length > 0
    );
  }

  getDay(dayNum: number): string {
    switch (dayNum) {
      case 0:
        return '일요일';
      case 1:
        return '월요일';
      case 2:
        return '화요일';
      case 3:
        return '수요일';
      case 4:
        return '목요일';
      case 5:
        return '금요일';
      case 6:
        return '토요일';
      default:
        break;
    }
  }

  async createSystemMessage(context: string, chatRoom: ChatRoom) {
    const message = await this.messageRepository.save(
      this.messageRepository.create({
        context,
        chatRoom,
        type: MessageType.System,
      }),
    );
    await this.pubSub.publish(NEW_MESSAGE, { listenNewMessage: message });
  }

  async createDateSystemMessage(chatRoom: ChatRoom) {
    const newDate = new Date();
    const context = `${newDate.getFullYear()}년 ${
      newDate.getMonth() + 1
    }월 ${newDate.getDate()}일 ${this.getDay(newDate.getDay())}`;
    const message = await this.messageRepository.save(
      this.messageRepository.create({
        context,
        chatRoom,
        type: MessageType.System,
      }),
    );
    await this.pubSub.publish(NEW_MESSAGE, { listenNewMessage: message });
  }

  async createChatRoom(
    user: User,
    { secret, password, name }: CreateChatRoomInput,
  ): Promise<CreateChatRoomOutput> {
    try {
      const chatRoom = this.chatRoomRepository.create({ users: [user], name });

      if (secret) {
        chatRoom.secret = secret;
        if (!password) {
          return this.commonService.errorMsg(
            '비밀 수다방 설정을 하려면 비밀번호를 입력해 주세요.',
          );
        }
        chatRoom.password = await this.commonService.hashPassword(password);
      }

      await this.chatRoomRepository.save(chatRoom);
      await this.createSystemMessage('수다방이 생성되었습니다.', chatRoom);

      return {
        ok: true,
        id: chatRoom.id,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async entranceChatRoom(
    user: User,
    { id, password }: EntranceChatRoomInput,
  ): Promise<EntranceChatRoomOutput> {
    try {
      const chatRoom = await this.chatRoomRepository.findOne({ id });
      if (!chatRoom) {
        return this.commonService.errorMsg('존재하지 않는 수다방 입니다.');
      }

      if (chatRoom.secret) {
        if (!password) {
          return this.commonService.errorMsg('비밀번호를 입력해 주세요.');
        }
        const comparePassword = await this.commonService.comparePassword(
          password,
          chatRoom.password,
        );
        if (!comparePassword) {
          return this.commonService.errorMsg('비밀번호가 일치하지 않습니다.');
        }
      }

      if (!this.isEntrance(chatRoom, user)) {
        const users = [...chatRoom.users, user];
        chatRoom.users = users;

        await this.chatRoomRepository.save(chatRoom);
        await this.createSystemMessage(
          `${user.name}님이 입장하였습니다.`,
          chatRoom,
        );
      }

      return {
        ok: true,
        id: chatRoom.id,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async exitChatRoom(
    user: User,
    { id }: ExitChatRoomInput,
  ): Promise<ExitChatRoomOutput> {
    try {
      const chatRoom = await this.chatRoomRepository.findOne({ id });
      if (!chatRoom) {
        return this.commonService.errorMsg('존재하지 않는 수다방 입니다.');
      }

      if (this.isEntrance(chatRoom, user)) {
        const users = chatRoom.users.filter(
          (chatUser) => chatUser.id !== user.id,
        );
        chatRoom.users = users;

        if (chatRoom.users.length === 0) {
          await this.chatRoomRepository.remove(chatRoom);
        } else {
          await this.chatRoomRepository.save(chatRoom);
          await this.createSystemMessage(
            `${user.name}님이 퇴장하였습니다.`,
            chatRoom,
          );
        }
      }

      return {
        ok: true,
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
      const chatRoom = await this.chatRoomRepository.findOne(
        { id },
        { relations: ['messages'] },
      );
      if (!chatRoom) {
        return this.commonService.errorMsg('존재하지 않는 수다방 입니다.');
      }

      if (!this.isEntrance(chatRoom, user)) {
        return this.commonService.errorMsg(
          '고객님이 참여 중인 수다방이 아닙니다.',
        );
      }

      return {
        ok: true,
        chatRoom,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async viewChatRooms(): Promise<ViewChatRoomsOutput> {
    try {
      const chatRooms = await this.chatRoomRepository.find();
      return {
        ok: true,
        chatRooms,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async isSecretChatRoom({
    id,
  }: IsSecretChatRoomInput): Promise<IsSecretChatRoomOutput> {
    try {
      const chatRoom = await this.chatRoomRepository.findOne({ id });
      if (!chatRoom) {
        return this.commonService.errorMsg('존재하지 않는 수다방 입니다.');
      }

      const isSecret = chatRoom.secret;

      const lastMessage = await this.messageRepository.find({
        order: {
          createdAt: 'DESC',
        },
        where: {
          chatRoom: {
            id: Equal(id),
          },
        },
        skip: 0,
        take: 1,
      });

      return {
        ok: true,
        isSecret,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async createMessage(
    writer: User,
    { context, chatRoomId }: CreateMessageInput,
  ): Promise<CreateMessageOutput> {
    try {
      const chatRoom = await this.chatRoomRepository.findOne({
        id: chatRoomId,
      });

      if (!chatRoom) {
        return this.commonService.errorMsg('존재하지 않는 수다방 입니다.');
      }

      if (!this.isEntrance(chatRoom, writer)) {
        return this.commonService.errorMsg(
          '고객님이 참여 중인 수다방이 아닙니다.',
        );
      }

      const lastMessage = await this.messageRepository.find({
        order: {
          createdAt: 'DESC',
        },
        where: {
          chatRoom: {
            id: Equal(chatRoomId),
          },
        },
        skip: 0,
        take: 1,
      });

      const lastMessageDate = lastMessage[0].createdAt.getDate();
      const currentDate = new Date().getDate();

      if (lastMessageDate !== currentDate) {
        await this.createDateSystemMessage(chatRoom);
      }

      const message = await this.messageRepository.save(
        this.messageRepository.create({
          context,
          writer,
          chatRoom,
          type: MessageType.User,
        }),
      );
      await this.pubSub.publish(NEW_MESSAGE, { listenNewMessage: message });
      return {
        ok: true,
        id: message.id,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }
}
