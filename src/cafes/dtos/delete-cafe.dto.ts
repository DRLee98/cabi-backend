import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Cafe } from '../entities/cafe.entity';

@InputType()
export class DeleteCafeInput extends PickType(Cafe, ['id']) {}

@ObjectType()
export class DeleteCafeOutput extends CoreOutput {}
