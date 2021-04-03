import {
  Field,
  InputType,
  Int,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Menu } from '../entities/menu.entity';
import { Nutrient } from '../entities/nutrient.entity';

@InputType()
class CreateNutrientInput extends OmitType(Nutrient, [
  'id',
  'menu',
  'createdAt',
  'updatedAt',
]) {}

@InputType()
export class CreateMenuInput extends PickType(Menu, [
  'name',
  'description',
  'price',
  'category',
  'options',
]) {
  @Field((type) => Int)
  cafeId: number;

  @Field((type) => String, { nullable: true })
  menuImg?: string;

  @Field((type) => CreateNutrientInput, { nullable: true })
  nutrient?: CreateNutrientInput;
}

@ObjectType()
export class CreateMenuOutput extends CoreOutput {}
