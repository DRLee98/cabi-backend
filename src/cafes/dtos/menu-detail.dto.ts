import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Menu } from '../entities/menu.entity';

@InputType()
export class MenuDetailInput {
  @Field((type) => Int)
  cafeId: number;

  @Field((type) => Int)
  menuId: number;
}

@ObjectType()
export class MenuDetailOutput extends CoreOutput {
  @Field((type) => Menu, { nullable: true })
  menu?: Menu;
}
