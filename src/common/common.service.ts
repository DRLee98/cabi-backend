import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/users/entites/user.entity';
import { CoreOutput } from './dtos/output.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CommonService {
  readonly InternalServerErrorOutput = {
    ok: false,
    error: 'Internal server error occurred.',
  };

  errorMsg(msg: string): CoreOutput {
    return { ok: false, error: msg };
  }

  vaildOwner(owner: User, cafeId: number): CoreOutput {
    try {
      if (owner.cafesId.includes(cafeId)) {
        return {
          ok: true,
        };
      }
      return this.errorMsg('사장님의 카페가 아닙니다.');
    } catch (e) {
      console.log(e);
      return this.InternalServerErrorOutput;
    }
  }

  async hashPassword(password: string): Promise<string> {
    if (password) {
      try {
        return await bcrypt.hash(password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async comparePassword(
    verifyPassword: string,
    password: string,
  ): Promise<boolean> {
    return await bcrypt.compare(verifyPassword, password);
  }
}
