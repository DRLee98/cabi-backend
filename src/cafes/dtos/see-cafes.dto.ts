import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Cafe } from '../entities/cafe.entity';

@ObjectType()
export class SeeCafeOutput extends CoreOutput {
  @Field((type) => [Cafe], { nullable: true })
  cafes?: Cafe[];
}
