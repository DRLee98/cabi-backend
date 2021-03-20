import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/users/entites/user.entity';
import {
  CreateCafeReviewInput,
  CreateCafeReviewOutput,
} from './dtos/create-cafe-review.dto';
import {
  CreateMenuReviewInput,
  CreateMenuReviewOutput,
} from './dtos/create-menu-review.dto';
import { CreateReplyInput, CreateReplyOutput } from './dtos/create-reply.dto';
import { DeleteReplyInput, DeleteReplyOutput } from './dtos/delete-reply.dto';
import {
  DeleteReviewInput,
  DeleteReviewOutput,
} from './dtos/delete-review.dto';
import { CafeService } from './cafes.service';
import { MenuService } from './menus.service';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { Reply } from './entities/reply.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    private readonly cafeService: CafeService,
    private readonly menuService: MenuService,
    private readonly commonService: CommonService,
  ) {}

  //카페 리뷰 생성
  async createCafeReview(
    writer: User,
    { contents, score, cafeId }: CreateCafeReviewInput,
  ): Promise<CreateCafeReviewOutput> {
    try {
      const { ok, error, cafe } = await this.cafeService.cafeDetail({
        id: cafeId,
      });
      if (!ok) {
        return this.commonService.errorMsg(error);
      }
      const review = this.reviewRepository.create({ contents, cafe, writer });
      const rating = await this.ratingRepository.save(
        this.ratingRepository.create({ score, cafe }),
      );
      review.rating = rating;
      await this.reviewRepository.save(review);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  //메뉴 리뷰 생성
  async createMenuReview(
    writer: User,
    { contents, score, cafeId, menuId }: CreateMenuReviewInput,
  ): Promise<CreateMenuReviewOutput> {
    try {
      const { ok, error, menu } = await this.menuService.menuDetail({
        cafeId,
        menuId,
      });
      if (!ok) {
        return this.commonService.errorMsg(error);
      }
      const review = this.reviewRepository.create({ contents, menu, writer });
      const rating = await this.ratingRepository.save(
        this.ratingRepository.create({ score, menu }),
      );
      review.rating = rating;
      await this.reviewRepository.save(review);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  //리뷰 삭제
  async deleteReview(
    user: User,
    { id }: DeleteReviewInput,
  ): Promise<DeleteReviewOutput> {
    try {
      const review = await this.reviewRepository.findOne({ id });
      if (!review) {
        return this.commonService.errorMsg('존재하지 않는 리뷰입니다.');
      }
      if (review.writer.id !== user.id) {
        console.log(review.writer, user);
        return this.commonService.errorMsg(
          '리뷰 삭제는 작성자만 할 수 있습니다.',
        );
      }
      await this.reviewRepository.remove(review);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  //답글 생성
  async createReply(
    writer: User,
    { contents, reviewId }: CreateReplyInput,
  ): Promise<CreateReplyOutput> {
    try {
      const review = await this.reviewRepository.findOne({ id: reviewId });
      if (!review) {
        return this.commonService.errorMsg('존재하지 않는 리뷰입니다.');
      }
      await this.replyRepository.save(
        this.replyRepository.create({ contents, writer, review }),
      );
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  //답글 삭제
  async deleteReply(
    user: User,
    { id }: DeleteReplyInput,
  ): Promise<DeleteReplyOutput> {
    try {
      const reply = await this.replyRepository.findOne({ id });
      if (!reply) {
        return this.commonService.errorMsg('존재하지 않는 답글입니다.');
      }
      if (reply.writer.id !== user.id) {
        console.log(reply.writer, user);
        return this.commonService.errorMsg(
          '답글 삭제는 작성자만 할 수 있습니다.',
        );
      }
      await this.replyRepository.remove(reply);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }
}
