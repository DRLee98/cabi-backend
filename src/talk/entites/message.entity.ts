import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/users/entites/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { ChatRoom } from './chatRoom.entity';

@InputType('MessageInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Message extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  context: string;

  @ManyToOne((type) => User, (user) => user.cafes, {
    onDelete: 'SET NULL',
  })
  @Field((type) => User)
  writer: User;

  @RelationId((message: Message) => message.writer)
  writerId: number;

  @ManyToOne((type) => ChatRoom, (chatRoom) => chatRoom.messages, {
    onDelete: 'CASCADE',
  })
  @Field((type) => ChatRoom)
  chatRoom: ChatRoom;
}
