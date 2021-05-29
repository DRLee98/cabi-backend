import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Address } from '../../common/entites/address.entity';
import { User } from '../entites/user.entity';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'name',
  'email',
  'password',
  'role',
]) {
  @Field((type) => Address)
  address: Address;

  @Field((type) => String, { nullable: true })
  originalProfileImg?: string;

  @Field((type) => String, { nullable: true })
  smallProfileImg?: string;
}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
