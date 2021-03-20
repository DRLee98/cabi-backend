import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entites/user.entity';
import { CreateMenuInput, CreateMenuOutput } from './dtos/create-menu.dto';
import { DeleteMenuInput, DeleteMenuOutput } from './dtos/delete-menu.dto';
import { EditMenuInput, EditMenuOutput } from './dtos/edit-menu.dto';
import { MenuDetailInput, MenuDetailOutput } from './dtos/menu-detail.dto';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menus.service';

@Resolver((of) => Menu)
export class MenuResolver {
  constructor(private readonly menuService: MenuService) {}

  @Role(['Owner'])
  @Mutation((returns) => CreateMenuOutput)
  createMenu(
    @AuthUser() owner: User,
    @Args('input') createMenuInput: CreateMenuInput,
  ): Promise<CreateMenuOutput> {
    return this.menuService.createMenu(owner, createMenuInput);
  }

  @Query((returns) => MenuDetailOutput)
  menuDetail(
    @Args('input') menuDetailInput: MenuDetailInput,
  ): Promise<MenuDetailOutput> {
    return this.menuService.menuDetail(menuDetailInput);
  }

  @Role(['Owner'])
  @Mutation((returns) => EditMenuOutput)
  editMenu(
    @AuthUser() owner: User,
    @Args('input') editMenuInput: EditMenuInput,
  ): Promise<EditMenuOutput> {
    return this.menuService.editMenu(owner, editMenuInput);
  }

  @Role(['Owner'])
  @Mutation((returns) => DeleteMenuOutput)
  deleteMenu(
    @AuthUser() owner: User,
    @Args('input') deleteMenuInput: DeleteMenuInput,
  ): Promise<DeleteMenuOutput> {
    return this.menuService.deleteMenu(owner, deleteMenuInput);
  }
}
