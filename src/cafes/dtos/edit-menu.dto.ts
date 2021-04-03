import {
  Field,
  InputType,
  Int,
  ObjectType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Menu } from '../entities/menu.entity';
import { Nutrient } from '../entities/nutrient.entity';

@InputType()
class EditNutrientInput extends OmitType(Nutrient, [
  'id',
  'menu',
  'createdAt',
  'updatedAt',
]) {}

@InputType()
export class EditMenuInput extends PartialType(
  PickType(Menu, [
    'name',
    'price',
    'description',
    'category',
    'menuImg',
    'options',
  ]),
) {
  @Field((type) => Int)
  cafeId: number;

  @Field((type) => Int)
  menuId: number;

  @Field((type) => EditNutrientInput, { nullable: true })
  editNutrient?: EditNutrientInput;
}

@ObjectType()
export class EditMenuOutput extends CoreOutput {}
