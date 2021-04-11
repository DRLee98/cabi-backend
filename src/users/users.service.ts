import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { Address } from '../common/entites/address.entity';
import { User } from './entites/user.entity';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { DeleteAccountOutput } from './dtos/delete-account.dto';
import { CommonService } from 'src/common/common.service';
import {
  ToggleLikeCafeInput,
  ToggleLikeCafeOutput,
} from './dtos/toggle-like-cafe.dto';
import { Cafe } from 'src/cafes/entities/cafe.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Cafe)
    private readonly cafeRepository: Repository<Cafe>,
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
  ) {}

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async createAccount({
    name,
    email,
    password,
    role,
    address,
    profileImg,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const findEmail = await this.usersRepository.findOne({ email });
      if (findEmail) {
        return this.commonService.errorMsg('이미 가입된 이메일입니다.');
      }
      const user = this.usersRepository.create({
        name,
        email,
        password,
        role,
        ...(profileImg && { profileImg }),
      });

      const hashPassword = await user.hashPassword(password);
      user.password = hashPassword;

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
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.usersRepository.findOne({ email });
      if (!user) {
        return this.commonService.errorMsg('존재하지 않는 유저입니다.');
      }
      const passwordCheck = await user.comparePassword(password);
      if (!passwordCheck) {
        return this.commonService.errorMsg('비밀번호가 틀립니다.');
      }
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async editProfile(
    userId: number,
    { name, password, oldPassword, profileImg, address }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.usersRepository.findOne(userId);

      if (address) {
        await this.addressRepository.save({ ...user.address, ...address });
      }

      if (name) user.name = name;
      if (profileImg) user.profileImg = profileImg;

      if (password) {
        if (oldPassword && (await user.comparePassword(oldPassword))) {
          if (password) user.password = await user.hashPassword(password);
        } else {
          return this.commonService.errorMsg(
            '이전 비밀번호가 일치하지 않습니다.',
          );
        }
      }

      await this.usersRepository.save(user);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async deleteAccount(user: User): Promise<DeleteAccountOutput> {
    try {
      if (!user) {
        return this.commonService.errorMsg('존재하지 않는 유저입니다.');
      }
      await this.usersRepository.remove(user);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async myProfile({ id }: User): Promise<UserProfileOutput> {
    try {
      const user = await this.usersRepository.findOne(id, {
        relations: ['likeCafes'],
      });
      if (!user) {
        return this.commonService.errorMsg('존재하지 않는 유저입니다.');
      }
      return {
        ok: true,
        user,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async userProfile({ id }: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.usersRepository.findOne(id, {
        relations: ['likeCafes'],
      });
      if (!user) {
        return this.commonService.errorMsg('존재하지 않는 유저입니다.');
      }
      return {
        ok: true,
        user,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async toggleLikeCafe(
    user: User,
    { cafeId }: ToggleLikeCafeInput,
  ): Promise<ToggleLikeCafeOutput> {
    try {
      const cafe = await this.cafeRepository.findOne(cafeId);
      if (!cafe) {
        return this.commonService.errorMsg('존재하지 않는 카페입니다.');
      }

      let likedCafe = [];
      const relationUser = await this.usersRepository.findOne(
        { id: user.id },
        {
          relations: ['likeCafes'],
        },
      );
      const liked = relationUser.likeCafes.filter((cafe) => cafe.id === cafeId);

      if (liked.length > 0) {
        likedCafe = relationUser.likeCafes.filter((cafe) => cafe.id !== cafeId);
      } else {
        likedCafe = [...relationUser.likeCafes, cafe];
      }
      relationUser.likeCafes = likedCafe;

      await this.usersRepository.save(relationUser);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }
}
