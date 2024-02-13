import { Module } from '@nestjs/common';
import UsersController from './user.controller';
import UsersService from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import UserService from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UserService, TypeOrmModule]
})
export default class UserModule { }
