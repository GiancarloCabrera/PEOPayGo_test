import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import UserService from './user.service';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminAccess } from 'src/auth/decorators/admin.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
@ApiHeader({
  name: 'access_token',
  required: true
})
export default class UserController {
  constructor(private usersService: UserService) { }

  @Post()
  @AdminAccess()
  public async createUser(@Body() user: CreateUserDto) {
    return await this.usersService.createUser(user);
  }

  @Put(':id')
  @AdminAccess()
  public async editUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: EditUserDto,
  ) {
    return this.usersService.editUser(id, user);
  }

  @Get('/list')
  @AdminAccess()
  public async getClients(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.usersService.getClients(page, limit);
  }

}
