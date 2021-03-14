import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Menu } from '../entities/menu.entity';
import { Nutrient } from '../entities/nutrient.entity';

@InputType()
export class CreateMenuInput extends PickType(Menu, [
  'name',
  'description',
  'price',
  'category',
]) {
  @Field((type) => Int)
  cafeId: number;

  @Field((type) => String, { nullable: true })
  menuImg?: string;

  @Field((type) => Nutrient, { nullable: true })
  nutrient?: Nutrient;
}

@ObjectType()
export class CreateMenuOutput extends CoreOutput {}
