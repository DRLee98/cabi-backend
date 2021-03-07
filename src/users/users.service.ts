import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { Address } from './entites/address.entity';
import { User } from './entites/user.entity';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { DeleteAccountOutput } from './dtos/delete-account.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly jwtService: JwtService,
  ) {}

  errorMsg(msg: string): CoreOutput {
    return { ok: false, error: msg };
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async createAccount({
    name,
    email,
    password,
    role,
    address,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const findEmail = await this.usersRepository.findOne({ email });
      if (findEmail) {
        return this.errorMsg('이미 가입된 이메일입니다.');
      }
      const user = this.usersRepository.create({
        name,
        email,
        password,
        role,
      });
      const userAddres = await this.addressRepository.save(
        this.addressRepository.create(address),
      );
      user.address = userAddres;
      await this.usersRepository.save(user);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.errorMsg('error');
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.usersRepository.findOne({ email });
      if (!user) {
        return this.errorMsg('존재하지 않는 유저입니다.');
      }
      const passwordCheck = await user.comparePassword(password);
      if (!passwordCheck) {
        return this.errorMsg('비밀번호가 틀립니다.');
      }
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (e) {
      console.log(e);
      return this.errorMsg('error');
    }
  }

  async editProfile(
    userId: number,
    { name, password, profileImg, address }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.usersRepository.findOne(userId);

      if (address) {
        await this.addressRepository.save({ ...user.address, ...address });
      }

      if (name) user.name = name;
      if (password) user.password = password;
      if (profileImg) user.profileImg = profileImg;

      await this.usersRepository.save(user);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.errorMsg('error');
    }
  }

  async deleteAccount(user: User): Promise<DeleteAccountOutput> {
    try {
      if (!user) {
        return this.errorMsg('존재하지 않는 유저입니다.');
      }
      if (user.address) {
        await this.addressRepository.remove(user.address);
      }
      await this.usersRepository.remove(user);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.errorMsg('계정을 삭제에 실패하였습니다.');
    }
  }

  async userProfile({ id }: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.usersRepository.findOne(id);
      if (!user) {
        return this.errorMsg('존재하지 않는 유저입니다.');
      }
      return {
        ok: true,
        user,
      };
    } catch (e) {
      console.log(e);
      return this.errorMsg('error');
    }
  }
}
