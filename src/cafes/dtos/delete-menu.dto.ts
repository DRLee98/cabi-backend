import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteMenuInput {
  @Field((type) => Int)
  cafeId: number;

  @Field((type) => Int)
  menuId: number;
}

@ObjectType()
export class DeleteMenuOutput extends CoreOutput {}
