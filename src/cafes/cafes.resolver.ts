import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entites/user.entity';
import { CafeService } from './cafes.service';
import { CafeDetailInput, CafeDetailOutput } from './dtos/cafe-detail.dto';
import { CreateCafeInput, CreateCafeOutput } from './dtos/create-cafe.dto';
import { DeleteCafeInput, DeleteCafeOutput } from './dtos/delete-cafe.dto';
import { EditCafeInput, EditCafeOutput } from './dtos/edit-cafe.dto';
import { KeywordsOutput } from './dtos/keywords.dto';
import {
  SearchCafesKeywordInput,
  SearchCafesKeywordOutput,
} from './dtos/search-cafes-keyword.dto';
import {
  SearchCafesLatLngInput,
  SearchCafesLatLngOutput,
} from './dtos/search-cafes-latlng.dto';
import { SearchCafesInput, SearchCafesOutput } from './dtos/search-cafes.dto';
import { SeeCafeOutput } from './dtos/see-cafes.dto';
import { Cafe } from './entities/cafe.entity';

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

  @Query((returns) => SeeCafeOutput)
  seeCafes(): Promise<SeeCafeOutput> {
    return this.cafeService.seeCafes();
  }

  @Query((returns) => SearchCafesOutput)
  searchCafes(
    @Args('input') searchCafeInput: SearchCafesInput,
  ): Promise<SearchCafesOutput> {
    return this.cafeService.searchCafes(searchCafeInput);
  }

  @Query((returns) => SeeCafeOutput)
  cafesRank(): Promise<SeeCafeOutput> {
    return this.cafeService.cafesRank();
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

  @Query((returns) => KeywordsOutput)
  viewKeywords(): Promise<KeywordsOutput> {
    return this.cafeService.viewKeywords();
  }

  @Query((returns) => SearchCafesKeywordOutput)
  searchCafesKeyword(
    @Args('input') searchCafesKeywordInput: SearchCafesKeywordInput,
  ): Promise<SearchCafesKeywordOutput> {
    return this.cafeService.searchCafesKeyword(searchCafesKeywordInput);
  }

  @Query((returns) => SearchCafesLatLngOutput)
  searchCafesLatLng(
    @Args('input') searchCafesLatLngInput: SearchCafesLatLngInput,
  ): Promise<SearchCafesLatLngOutput> {
    return this.cafeService.searchCafesLatLng(searchCafesLatLngInput);
  }
}
