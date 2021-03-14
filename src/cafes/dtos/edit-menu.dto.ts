import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Menu } from '../entities/menu.entity';

@InputType()
export class EditMenuInput extends PartialType(
  PickType(Menu, ['name', 'price', 'description', 'category', 'menuImg', 'nutrient']),
) {
  @Field((type) => Int)
  cafeId: number;

  @Field((type) => Int)
  menuId: number;
}

@ObjectType()
export class EditMenuOutput extends CoreOutput {}
