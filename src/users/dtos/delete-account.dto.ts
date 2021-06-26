import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entites/user.entity';

@InputType()
export class DeleteAccountInput extends PickType(User, ['password']) {}

@ObjectType()
export class DeleteAccountOutput extends CoreOutput {}
