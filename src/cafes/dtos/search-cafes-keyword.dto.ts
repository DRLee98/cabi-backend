import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Cafe } from '../entities/cafe.entity';
import { Keyword } from '../entities/keyword.entity';

@InputType()
export class SearchCafesKeywordInput extends PickType(Keyword, ['slug']) {}

@ObjectType()
export class SearchCafesKeywordOutput extends CoreOutput {
  @Field((type) => [Cafe], { nullable: true })
  cafes?: Cafe[];
}
