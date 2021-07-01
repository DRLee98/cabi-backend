import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { DeleteAccountInput, DeleteAccountOutput } from './dtos/delete-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { MyChatRoomOutput } from './dtos/my-chat-room.dto';
import {
  ToggleLikeCafeInput,
  ToggleLikeCafeOutput,
} from './dtos/toggle-like-cafe.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entites/user.entity';
import { UserService } from './users.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Mutation((returns) => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation((returns) => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Role(['Any'])
  @Mutation((returns) => EditProfileOutput)
  editProfile(
    @AuthUser() user: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(user.id, editProfileInput);
  }

  @Role(['Any'])
  @Mutation((returns) => DeleteAccountOutput)
  deleteAccount(
    @AuthUser() user: User,
    @Args('input') deleteAccountInput: DeleteAccountInput,
  ): Promise<DeleteAccountOutput> {
    return this.usersService.deleteAccount(user, deleteAccountInput);
  }

  @Role(['Any'])
  @Query((returns) => UserProfileOutput)
  myProfile(@AuthUser() user: User): Promise<UserProfileOutput> {
    return this.usersService.userProfile(user);
  }

  @Query((returns) => UserProfileOutput)
  userProfile(
    @Args('input') userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.userProfile(userProfileInput);
  }

  @Role(['Client'])
  @Mutation((returns) => ToggleLikeCafeOutput)
  toggleLikeCafe(
    @AuthUser() user: User,
    @Args('input') toggleLikeCafeInput: ToggleLikeCafeInput,
  ): Promise<ToggleLikeCafeOutput> {
    return this.usersService.toggleLikeCafe(user, toggleLikeCafeInput);
  }

  @Role(['Any'])
  @Query((returns) => MyChatRoomOutput)
  myChatRooms(@AuthUser() user: User): Promise<MyChatRoomOutput> {
    return this.usersService.myChatRooms(user);
  }
}
