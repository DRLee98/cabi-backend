import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class ToggleLikeCafeInput {
  @Field((type) => Int)
  cafeId: number;
}

@ObjectType()
export class ToggleLikeCafeOutput extends CoreOutput {}
