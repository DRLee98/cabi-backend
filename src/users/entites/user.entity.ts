import * as bcrypt from 'bcrypt';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from '../../common/entites/core.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  RelationId,
} from 'typeorm';
import { Address } from '../../common/entites/address.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Cafe } from '../../cafes/entities/cafe.entity';
import { Review } from '../../cafes/entities/review.entity';
import { Reply } from 'src/cafes/entities/reply.entity';

export enum UserRole {
  Owner = 'Owner',
  Client = 'Client',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  name: string;

  @Column()
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column()
  @Field((type) => String)
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  profileImg?: string;

  @OneToOne((type) => Address, (address) => address.user, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @Field((type) => Address)
  address: Address;

  @OneToMany((type) => Cafe, (cafe) => cafe.owner, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field((type) => [Cafe], { nullable: true })
  cafes?: Cafe[];

  @RelationId((user: User) => user.cafes)
  cafesId: number[];

  @ManyToMany((type) => Cafe, (cafe) => cafe.likedUsers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinTable()
  @Field((type) => [Cafe], { nullable: true })
  likeCafes?: Cafe[];

  @OneToMany((type) => Review, (review) => review.writer, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field((type) => [Review], { nullable: true })
  review?: Review[];

  @OneToMany((type) => Reply, (reply) => reply.writer, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field((type) => [Reply], { nullable: true })
  reply?: Reply[];

  async hashPassword(password: string): Promise<string> {
    if (password) {
      try {
        return await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async comparePassword(verifyPassword: string) {
    return await bcrypt.compare(verifyPassword, this.password);
  }
}
