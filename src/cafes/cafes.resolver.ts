import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entites/user.entity';
import { CafeService } from './cafes.service';
import { CafeDetailInput, CafeDetailOutput } from './dtos/cafe-detail.dto';
import { CreateCafeInput, CreateCafeOutput } from './dtos/create-cafe.dto';
import { CreateMenuInput, CreateMenuOutput } from './dtos/create-menu.dto';
import { DeleteCafeInput, DeleteCafeOutput } from './dtos/delete-cafe.dto';
import { DeleteMenuInput, DeleteMenuOutput } from './dtos/delete-menu.dto';
import { EditCafeInput, EditCafeOutput } from './dtos/edit-cafe.dto';
import { EditMenuInput, EditMenuOutput } from './dtos/edit-menu.dto';
import { MenuDetailInput, MenuDetailOutput } from './dtos/menu-detail.dto';
import { SeeCafeOutput } from './dtos/see-cafes.dto';
import { Cafe } from './entities/cafe.entity';
import { Menu } from './entities/menu.entity';
import { Review } from './entities/review.entity';

@Resolver((of) => Cafe)
export class CafeResolver {
  constructor(private readonly cafeService: CafeService) {}

  @Role(['Owner'])
  @Mutation((returns) => CreateCafeOutput)
  createCafe(
    @AuthUser() owner: User,
    @Args('input') createCafeInput: CreateCafeInput,
  ): Promise<CreateCafeOutput> {
    return this.cafeService.createCafe(owner, createCafeInput);
  }

  @Role(['Owner'])
  @Query((returns) => SeeCafeOutput)
  myCafes(@AuthUser() owner: User): Promise<SeeCafeOutput> {
    return this.cafeService.myCafes(owner);
  }

  @Query((returns) => CafeDetailOutput)
  cafeDetail(
    @Args('input') cafeDetailInput: CafeDetailInput,
  ): Promise<CafeDetailOutput> {
    return this.cafeService.cafeDetail(cafeDetailInput);
  }

  @Role(['Owner'])
  @Mutation((returns) => EditCafeOutput)
  editCafe(
    @AuthUser() owner: User,
    @Args('input') editCafeInput: EditCafeInput,
  ): Promise<CreateCafeOutput> {
    return this.cafeService.editCafe(owner, editCafeInput);
  }

  @Role(['Owner'])
  @Mutation((returns) => DeleteCafeOutput)
  deleteCafe(
    @AuthUser() owner: User,
    @Args('input') deleteCafeInput: DeleteCafeInput,
  ): Promise<DeleteCafeOutput> {
    return this.cafeService.deleteCafe(owner, deleteCafeInput);
  }
}

@Resolver((of) => Menu)
export class MenuResolver {
  constructor(private readonly cafeService: CafeService) {}

  @Role(['Owner'])
  @Mutation((returns) => CreateMenuOutput)
  createMenu(
    @AuthUser() owner: User,
    @Args('input') createMenuInput: CreateMenuInput,
  ): Promise<CreateMenuOutput> {
    return this.cafeService.createMenu(owner, createMenuInput);
  }

  @Query((returns) => MenuDetailOutput)
  menuDetail(
    @Args('input') menuDetailInput: MenuDetailInput,
  ): Promise<MenuDetailOutput> {
    return this.cafeService.menuDetail(menuDetailInput);
  }

  @Role(['Owner'])
  @Mutation((returns) => EditMenuOutput)
  editMenu(
    @AuthUser() owner: User,
    @Args('input') editMenuInput: EditMenuInput,
  ): Promise<EditMenuOutput> {
    return this.cafeService.editMenu(owner, editMenuInput);
  }

  @Role(['Owner'])
  @Mutation((returns) => DeleteMenuOutput)
  deleteMenu(
    @AuthUser() owner: User,
    @Args('input') deleteMenuInput: DeleteMenuInput,
  ): Promise<DeleteMenuOutput> {
    return this.cafeService.deleteMenu(owner, deleteMenuInput);
  }
}

@Resolver((of) => Review)
export class ReviewResolver {
  constructor(private readonly cafeService: CafeService) {}
}
