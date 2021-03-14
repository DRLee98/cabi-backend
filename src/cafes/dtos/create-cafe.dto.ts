import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Address } from 'src/common/entites/address.entity';
import { Cafe } from '../entities/cafe.entity';

@InputType()
export class CreateCafeInput extends PickType(Cafe, ['name', 'description']) {
  @Field((type) => Address)
  address: Address;

  @Field((type) => String, { nullable: true })
  coverImg?: string;

  @Field((type) => [String], { nullable: true })
  keywordsName?: string[];
}

@ObjectType()
export class CreateCafeOutput extends CoreOutput {
  @Field((type) => Int, { nullable: true })
  cafeId?: number;
}
