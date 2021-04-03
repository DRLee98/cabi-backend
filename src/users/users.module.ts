import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cafe } from 'src/cafes/entities/cafe.entity';
import { CommonService } from 'src/common/common.service';
import { Address } from '../common/entites/address.entity';
import { User } from './entites/user.entity';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address, Cafe])],
  providers: [UserResolver, UserService, CommonService],
  exports: [UserService],
})
export class UsersModule {}
