import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Address } from '../../common/entites/address.entity';
import { User } from '../entites/user.entity';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['name', 'password', 'originalProfileImg', 'smallProfileImg']),
) {
  @Field((type) => String, { nullable: true })
  oldPassword?: string;

  @Field((type) => Address, { nullable: true })
  address?: Address;
}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
