import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Cafe } from '../entities/cafe.entity';

@InputType()
export class SearchCafesInput {
  @Field((type) => String)
  word: string;
}

@ObjectType()
export class SearchCafesOutput extends CoreOutput {
  @Field((type) => [Cafe], { nullable: true })
  cafes?: Cafe[];
}
