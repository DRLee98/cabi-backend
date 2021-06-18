import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Address } from 'src/common/entites/address.entity';
import { User } from 'src/users/entites/user.entity';
import { Between, ILike, IsNull, Not, Repository } from 'typeorm';
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
import { Keyword } from './entities/keyword.entity';

@Injectable()
export class CafeService {
  constructor(
    @InjectRepository(Cafe)
    private readonly cafeRepository: Repository<Cafe>,
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly commonService: CommonService,
  ) {}

  //키워드가 이미 있는지 찾아보고 없으면 생성
  async findAndCreateKeywords(keywordsName: string[]): Promise<Keyword[]> {
    const keywords = await Promise.all(
      keywordsName.map(async (name) => {
        if (name !== '' || name !== null || name != undefined) {
          const keywordName = name.trim().toLowerCase();
          const keywordSlug = keywordName.replace(/ /g, '_');
          let keyword = await this.keywordRepository.findOne({
            slug: keywordSlug,
          });
          if (!keyword) {
            keyword = await this.keywordRepository.save(
              this.keywordRepository.create({
                name: keywordName,
                slug: keywordSlug,
              }),
            );
          }
          return keyword;
        }
      }),
    );
    return keywords;
  }

  //카페 생성
  async createCafe(
    owner: User,
    {
      name,
      description,
      originalCoverImg,
      smallCoverImg,
      address,
      keywordsName,
    }: CreateCafeInput,
  ): Promise<CreateCafeOutput> {
    try {
      const findName = await this.cafeRepository.findOne({ name });
      if (findName) {
        return this.commonService.errorMsg('이미 사용중인 카페 이름입니다.');
      }
      if (!address) {
        return this.commonService.errorMsg('주소 입력은 필수입니다.');
      }
      const createCafe = this.cafeRepository.create({
        name,
        description,
        originalCoverImg,
        smallCoverImg,
      });
      if (keywordsName) {
        const keywords = await this.findAndCreateKeywords(keywordsName);
        createCafe.keywords = keywords;
      }
      const cafeAddress = await this.addressRepository.save(
        this.addressRepository.create(address),
      );
      createCafe.address = cafeAddress;
      createCafe.owner = owner;
      const newCafe = await this.cafeRepository.save(createCafe);
      return {
        ok: true,
        cafeId: newCafe.id,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  // 카페 조회
  async seeCafes(): Promise<SeeCafeOutput> {
    try {
      const cafes = await this.cafeRepository.find();
      return {
        ok: true,
        cafes,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  // 카페 검색
  async searchCafes({ word }: SearchCafesInput): Promise<SearchCafesOutput> {
    try {
      const cafes = await this.cafeRepository.find({
        where: { name: ILike(`%${word}%`) },
      });
      return {
        ok: true,
        cafes,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  // 카페 순위별로 조회
  async cafesRank(): Promise<SeeCafeOutput> {
    try {
      const cafes = await this.cafeRepository.find({
        order: { totalScore: 'DESC' },
        take: 10,
      });
      return {
        ok: true,
        cafes,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  //오너가 가진 카페들 조회
  async myCafes(owner: User): Promise<SeeCafeOutput> {
    try {
      const findMyCafe = await this.cafeRepository.find({ owner });
      const findCafe = await this.cafeRepository.find({
        where: {
          owner: { id: Not(owner.id) },
        },
      });
      return {
        ok: true,
        myCafes: findMyCafe,
        cafes: findCafe,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  //카페 상세 조회
  async cafeDetail({ id }: CafeDetailInput): Promise<CafeDetailOutput> {
    try {
      const findCafe = await this.cafeRepository.findOne(id, {
        relations: ['menus', 'reviews'],
      });
      if (!findCafe) {
        return this.commonService.errorMsg('존재하지 않는 카페 입니다.');
      }
      return {
        ok: true,
        cafe: findCafe,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  //카페 수정
  async editCafe(
    owner: User,
    { cafeId, keywordsName, address, name, ...rest }: EditCafeInput,
  ): Promise<EditCafeOutput> {
    try {
      const { ok, error, cafe: findCafe } = await this.cafeDetail({
        id: cafeId,
      });
      if (!ok) {
        return this.commonService.errorMsg(error);
      }
      const { ok: validOk, error: validError } = this.commonService.vaildOwner(
        owner,
        cafeId,
      );
      if (!validOk) {
        return this.commonService.errorMsg(validError);
      }
      if (name && findCafe.name !== name) {
        const findName = await this.cafeRepository.findOne({ name });
        if (findName) {
          return this.commonService.errorMsg('이미 사용중인 카페이름 입니다.');
        }
        findCafe.name = name;
      }
      if (address) {
        await this.addressRepository.save({ ...findCafe.address, ...address });
      }
      if (keywordsName) {
        const keywords = await this.findAndCreateKeywords(keywordsName);
        findCafe.keywords = keywords;
      }
      await this.cafeRepository.save({
        ...findCafe,
        ...rest,
      });
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  //카페 삭제
  async deleteCafe(
    owner: User,
    { id }: DeleteCafeInput,
  ): Promise<DeleteCafeOutput> {
    try {
      const { ok, error, cafe: findCafe } = await this.cafeDetail({ id });
      if (!ok) {
        return this.commonService.errorMsg(error);
      }
      const { ok: validOk, error: validError } = this.commonService.vaildOwner(
        owner,
        id,
      );
      if (!validOk) {
        return this.commonService.errorMsg(validError);
      }
      await this.cafeRepository.remove(findCafe);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async viewKeywords(): Promise<KeywordsOutput> {
    try {
      const keywords = await this.keywordRepository.find();
      return {
        ok: true,
        keywords,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async searchCafesKeyword({
    slug,
  }: SearchCafesKeywordInput): Promise<SearchCafesKeywordOutput> {
    try {
      const { cafes } = await this.keywordRepository.findOne(
        { slug },
        {
          relations: ['cafes'],
        },
      );
      return {
        ok: true,
        cafes,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async searchCafesLatLng({
    top,
    bottom,
    left,
    right,
  }: SearchCafesLatLngInput): Promise<SearchCafesLatLngOutput> {
    try {
      const array = await this.addressRepository.find({
        where: {
          lat: Between(bottom, top),
          lng: Between(left, right),
          cafe: Not(IsNull()),
        },
        relations: ['cafe'],
      });

      const cafes = array.map((item) => item.cafe);

      return {
        ok: true,
        cafes,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  //매시 0분마다 별점 합산
  @Cron('0 0 * * * *')
  async cafeScoreSet() {
    const cafes = await this.cafeRepository.find();
    cafes.forEach(async (cafe) => {
      let totalScore = 0;
      cafe.ratings.forEach((ratings) => (totalScore += ratings.score));
      cafe.totalScore = totalScore;
      cafe.avgScore =
        totalScore > 0
          ? Math.floor((totalScore / cafe.ratings.length) * 100) / 100
          : 0;
      await this.cafeRepository.save(cafe);
    });
  }
}
