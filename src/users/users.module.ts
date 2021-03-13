import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../common/entites/address.entity';
import { User } from './entites/user.entity';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
