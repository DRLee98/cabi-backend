import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entites/user.entity';
import {
  CreateCafeReviewInput,
  CreateCafeReviewOutput,
} from './dtos/create-cafe-review.dto';
import {
  CreateMenuReviewInput,
  CreateMenuReviewOutput,
} from './dtos/create-review.dto';
import { CreateReplyInput, CreateReplyOutput } from './dtos/create-reply.dto';
import { DeleteReplyInput, DeleteReplyOutput } from './dtos/delete-reply.dto';
import {
  DeleteReviewInput,
  DeleteReviewOutput,
} from './dtos/delete-review.dto';
import { Review } from './entities/review.entity';
import { ReviewService } from './reviews.service';

@Resolver((of) => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Role(['Client'])
  @Mutation((returns) => CreateCafeReviewOutput)
  createCafeReview(
    @AuthUser() writer: User,
    @Args('input') createCafeReviewInput: CreateCafeReviewInput,
  ): Promise<CreateCafeReviewOutput> {
    return this.reviewService.createCafeReview(writer, createCafeReviewInput);
  }

  @Role(['Any'])
  @Mutation((returns) => CreateMenuReviewOutput)
  createMenuReview(
    @AuthUser() writer: User,
    @Args('input') createMenuReviewInput: CreateMenuReviewInput,
  ): Promise<CreateMenuReviewOutput> {
    return this.reviewService.createMenuReview(writer, createMenuReviewInput);
  }

  @Role(['Any'])
  @Mutation((returns) => DeleteReviewOutput)
  deleteReview(
    @AuthUser() writer: User,
    @Args('input') deleteReviewInput: DeleteReviewInput,
  ): Promise<DeleteReviewOutput> {
    return this.reviewService.deleteReview(writer, deleteReviewInput);
  }

  @Role(['Any'])
  @Mutation((returns) => CreateReplyOutput)
  createReply(
    @AuthUser() writer: User,
    @Args('input') createReplyInput: CreateReplyInput,
  ): Promise<CreateReplyOutput> {
    return this.reviewService.createReply(writer, createReplyInput);
  }

  @Role(['Any'])
  @Mutation((returns) => DeleteReplyOutput)
  deleteReply(
    @AuthUser() writer: User,
    @Args('input') deleteReplyInput: DeleteReplyInput,
  ): Promise<DeleteReplyOutput> {
    return this.reviewService.deleteReply(writer, deleteReplyInput);
  }
}
