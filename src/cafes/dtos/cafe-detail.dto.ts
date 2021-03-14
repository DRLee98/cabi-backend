import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Cafe } from '../entities/cafe.entity';

@InputType()
export class CafeDetailInput extends PickType(Cafe, ['id']) {}

@ObjectType()
export class CafeDetailOutput extends CoreOutput {
  @Field((type) => Cafe, { nullable: true })
  cafe?: Cafe;
}
