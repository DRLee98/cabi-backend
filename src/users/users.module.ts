import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Address } from '../common/entites/address.entity';
import { User } from './entites/user.entity';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  providers: [UserResolver, UserService, CommonService],
  exports: [UserService],
})
export class UsersModule {}
