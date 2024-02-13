import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ROLES } from 'src/constants/roles';
import { EditUserDto } from './dto/edit-user.dto';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  public async createUser(user: CreateUserDto): Promise<User> {
    try {
      const userFound = await this.userRepository.findOne({
        where: {
          email: user.email
        },
      });

      if (userFound) throw new ErrorManager({ type: 'BAD_REQUEST', msg: 'User already exists, use another email...' });

      const hashedPwd: string = await bcrypt.hash(user.password, +process.env.HASH_SALT);
      user.password = hashedPwd;

      if (user.role === ROLES.ADMIN) {
        user.company = 'PEOPayGo';
      } else if (user.role === ROLES.CLIENT && !user.company) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          msg: 'Clients must belong to a company!'
        });
      }

      const savedUser: User = await this.userRepository.save(user);

      return savedUser;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async editUser(id: number, user: EditUserDto) {
    try {
      const foundUser = await this.findUserById(id);

      if (foundUser.role === ROLES.ADMIN) throw new ErrorManager({ type: 'UNAUTHORIZED', msg: 'You cannot edit this user...' });

      Object.assign(foundUser, user);
      const hashedPwd = await bcrypt.hash(user.password, +process.env.HASH_SALT);
      foundUser.password = hashedPwd;

      const editUser = await this.userRepository.save(foundUser);
      return editUser;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findBy({ key, value }: { key: keyof CreateUserDto, value: any }) {
    try {
      const user: User = await this.userRepository.createQueryBuilder('user').addSelect('user.password').where({ [key]: value }).getOne();
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findUserById(id: number): Promise<User> {
    try {
      const userFound = await this.userRepository.findOne({
        where: {
          id,
        },
      });

      if (!userFound) throw new ErrorManager({ type: 'NOT_FOUND', msg: 'User not found...' });

      return userFound;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
