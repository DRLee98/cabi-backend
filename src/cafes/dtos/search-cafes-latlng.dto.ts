import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Cafe } from '../entities/cafe.entity';

@InputType()
export class SearchCafesLatLngInput {
  @Field((type) => Float)
  top: number;
  @Field((type) => Float)
  bottom: number;
  @Field((type) => Float)
  left: number;
  @Field((type) => Float)
  right: number;
}

@ObjectType()
export class SearchCafesLatLngOutput extends CoreOutput {
  @Field((type) => [Cafe], { nullable: true })
  cafes?: Cafe[];
}
