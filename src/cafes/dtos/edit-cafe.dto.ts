import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Address } from 'src/common/entites/address.entity';
import { Cafe } from '../entities/cafe.entity';

@InputType()
export class EditCafeInput extends PartialType(
  PickType(Cafe, ['name', 'description', 'originalCoverImg', 'smallCoverImg']),
) {
  @Field((type) => Int)
  cafeId: number;

  @Field((type) => Address, { nullable: true })
  address?: Address;

  @Field((type) => [String], { nullable: true })
  keywordsName?: string[];
}

@ObjectType()
export class EditCafeOutput extends CoreOutput {}
