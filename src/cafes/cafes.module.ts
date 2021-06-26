import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Address } from 'src/common/entites/address.entity';
import { UploadService } from 'src/uploads/uploads.service';
import { CafeResolver } from './cafes.resolver';
import { CafeService } from './cafes.service';
import { Cafe } from './entities/cafe.entity';
import { Keyword } from './entities/keyword.entity';
import { Menu } from './entities/menu.entity';
import { Nutrient } from './entities/nutrient.entity';
import { Rating } from './entities/rating.entity';
import { Reply } from './entities/reply.entity';
import { Review } from './entities/review.entity';
import { MenuResolver } from './menus.resolver';
import { MenuService } from './menus.service';
import { ReviewResolver } from './reviews.resolver';
import { ReviewService } from './reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cafe,
      Keyword,
      Menu,
      Nutrient,
      Review,
      Rating,
      Address,
      Reply,
    ]),
  ],
  providers: [
    CafeResolver,
    MenuResolver,
    ReviewResolver,
    CafeService,
    MenuService,
    ReviewService,
    CommonService,
    UploadService,
  ],
})
export class CafesModule {}
