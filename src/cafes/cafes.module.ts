import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Address } from 'src/common/entites/address.entity';
import { CafeResolver, MenuResolver, ReviewResolver } from './cafes.resolver';
import { CafeService } from './cafes.service';
import { Cafe } from './entities/cafe.entity';
import { Keyword } from './entities/keyword.entity';
import { Menu } from './entities/menu.entity';
import { Nutrient } from './entities/nutrient.entity';
import { Rating } from './entities/rating.entity';
import { Review } from './entities/review.entity';

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
    ]),
  ],
  providers: [
    CafeResolver,
    MenuResolver,
    ReviewResolver,
    CafeService,
    CommonService,
  ],
})
export class CafesModule {}
