import {
  Injectable,
} from '@nestjs/common';
import UserService from 'src/users/user.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import User from 'src/users/entities/user.entity';
import { PayloadToken } from './interfaces/auth.interface';

@Injectable()
export default class AuthService {
  constructor(private readonly userService: UserService) { }

  public async validateUser(email: string, password: string) {
    const userByEmail = await this.userService.findBy({
      key: 'email',
      value: email
    });
    console.log(userByEmail);

    if (userByEmail) {
      const match = await bcrypt.compare(password, userByEmail.password);
      if (match) return userByEmail;
    }

    return null;
  }

  public signJWT({ payload, secret, expires }: { payload: jwt.JwtPayload; secret: string; expires: number | string }) {
    return jwt.sign(payload, secret, { expiresIn: expires });
  }

  public async generateJWT(user: User): Promise<any> {
    const getUser = await this.userService.findUserById(user.id);

    const payload: PayloadToken = {
      sub: getUser.id.toString(),
      role: getUser.role
    }

    return {
      accessToken: this.signJWT({
        payload,
        secret: process.env.JWT_SECRET,
        expires: '1h'
      }),
      user
    }
  }
}
