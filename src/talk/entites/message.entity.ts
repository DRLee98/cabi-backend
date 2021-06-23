import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/users/entites/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { ChatRoom } from './chatRoom.entity';

export enum MessageType {
  User = 'User',
  System = 'System',
}

registerEnumType(MessageType, { name: 'MessageType' });

@InputType('MessageInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Message extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  context: string;

  @Column({ type: 'enum', enum: MessageType })
  @Field((type) => MessageType)
  @IsEnum(MessageType)
  type: MessageType;

  @ManyToOne((type) => User, (user) => user.cafes, {
    onDelete: 'SET NULL',
    eager: true,
    nullable: true,
  })
  @Field((type) => User, { nullable: true })
  writer?: User;

  @RelationId((message: Message) => message.writer)
  writerId: number;

  @ManyToOne((type) => ChatRoom, (chatRoom) => chatRoom.messages, {
    onDelete: 'CASCADE',
  })
  @Field((type) => ChatRoom)
  chatRoom: ChatRoom;
}
