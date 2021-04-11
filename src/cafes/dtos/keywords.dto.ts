import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Keyword } from '../entities/keyword.entity';

@ObjectType()
export class KeywordsOutput extends CoreOutput {
  @Field((type) => [Keyword])
  keywords?: Keyword[];
}