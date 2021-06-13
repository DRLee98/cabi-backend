import { Module } from '@nestjs/common';

import * as Joi from 'joi';

import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { CafesModule } from './cafes/cafes.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';

import { User } from './users/entites/user.entity';
import { Address } from './common/entites/address.entity';
import { JwtModule } from './jwt/jwt.module';
import { Menu } from './cafes/entities/menu.entity';
import { Cafe } from './cafes/entities/cafe.entity';
import { Review } from './cafes/entities/review.entity';
import { Rating } from './cafes/entities/rating.entity';
import { Nutrient } from './cafes/entities/nutrient.entity';
import { Keyword } from './cafes/entities/keyword.entity';
import { Reply } from './cafes/entities/reply.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TalkModule } from './talk/talk.module';
import { ChatRoom } from './talk/entites/chatRoom.entity';
import { Message } from './talk/entites/message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.prod.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      playground: process.env.NODE_ENV !== 'production',
      autoSchemaFile: true,
      context: ({ req, connection }) => {
        if (req) {
          return { token: req.headers['x-jwt'] };
        } else if (connection) {
          console.log(connection);
        }
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Address,
        Cafe,
        Menu,
        Review,
        Rating,
        Nutrient,
        Keyword,
        Reply,
        ChatRoom,
        Message,
      ],
      synchronize: true,
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    CafesModule,
    ReviewsModule,
    CommonModule,
    AuthModule,
    UploadsModule,
    TalkModule,
  ],
})
export class AppModule {}
