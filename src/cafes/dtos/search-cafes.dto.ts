import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Cafe } from '../entities/cafe.entity';

@InputType()
export class SearchCafeInput {
  @Field((type) => String)
  word: string;
}

@ObjectType()
export class SearchCafeOutput extends CoreOutput {
  @Field((type) => [Cafe], { nullable: true })
  cafes?: Cafe[];
}
