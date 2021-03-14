import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Address } from 'src/common/entites/address.entity';
import { User } from 'src/users/entites/user.entity';
import { Repository } from 'typeorm';
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
import { Keyword } from './entities/keyword.entity';
import { Menu } from './entities/menu.entity';
import { Nutrient } from './entities/nutrient.entity';
import { Rating } from './entities/rating.entity';
import { Review } from './entities/review.entity';

@Injectable()
export class CafeService {
  constructor(
    @InjectRepository(Cafe)
    private readonly cafeRepository: Repository<Cafe>,
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Nutrient)
    private readonly nutrientRepository: Repository<Nutrient>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly commonService: CommonService,
  ) {}

  //키워드가 이미 있는지 찾아보고 없으면 생성
  findAndCreateKeywords(keywordsName: string[]): Keyword[] {
    const keywords: Keyword[] = [];
    keywordsName.forEach(async (name) => {
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
      keywords.push(keyword);
    });
    return keywords;
  }

  vaildOwner(owner: User, cafeId: number): CoreOutput {
    try {
      if (owner.cafesId.includes(cafeId)) {
        return {
          ok: true,
        };
      }
      return this.commonService.errorMsg('사장님의 카페가 아닙니다.');
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  // ==========카페 START==========

  //카페 생성
  async createCafe(
    owner: User,
    { name, description, coverImg, address, keywordsName }: CreateCafeInput,
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
        coverImg,
      });
      if (keywordsName) {
        const keywords = this.findAndCreateKeywords(keywordsName);
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

  //오너가 가진 카페들 조회
  async myCafes(owner: User): Promise<SeeCafeOutput> {
    try {
      const findCafe = await this.cafeRepository.find({ owner });
      console.log(owner.cafesId);
      return {
        ok: true,
        cafe: findCafe,
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
      const { ok: validOk, error: validError } = this.vaildOwner(owner, cafeId);
      if (!validOk) {
        return this.commonService.errorMsg(validError);
      }
      if (name) {
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
        const keywords = this.findAndCreateKeywords(keywordsName);
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
      const { ok: validOk, error: validError } = this.vaildOwner(owner, id);
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

  // ==========카페 END==========

  // ==========메뉴 STRAT==========

  //메뉴 생성
  async createMenu(
    owner: User,
    {
      cafeId,
      name,
      price,
      description,
      menuImg,
      category,
      nutrient,
    }: CreateMenuInput,
  ): Promise<CreateMenuOutput> {
    try {
      const { ok, error, cafe: findCafe } = await this.cafeDetail({
        id: cafeId,
      });
      if (!ok) {
        return this.commonService.errorMsg(error);
      }
      const { ok: validOk, error: validError } = this.vaildOwner(owner, cafeId);
      if (!validOk) {
        return this.commonService.errorMsg(validError);
      }
      const menu = this.menuRepository.create({
        name,
        price,
        description,
        category,
        ...(menuImg && { menuImg }),
      });
      const menuNutrient = await this.nutrientRepository.save(
        this.nutrientRepository.create(nutrient),
      );
      menu.nutrient = menuNutrient;
      menu.cafe = findCafe;
      await this.menuRepository.save(menu);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  //메뉴 상세 조회
  async menuDetail({
    cafeId,
    menuId,
  }: MenuDetailInput): Promise<MenuDetailOutput> {
    try {
      const { ok, error } = await this.cafeDetail({
        id: cafeId,
      });
      if (!ok) {
        return this.commonService.errorMsg(error);
      }
      const findMenu = await this.menuRepository.findOne(
        { id: menuId },
        { relations: ['nutrient'] },
      );
      if (!findMenu) {
        return this.commonService.errorMsg('존재하지 않는 메뉴 입니다.');
      }
      return {
        ok: true,
        menu: findMenu,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  //메뉴 수정
  async editMenu(
    owner: User,
    { cafeId, menuId, nutrient, ...rest }: EditMenuInput,
  ): Promise<EditMenuOutput> {
    try {
      const { ok, error, menu } = await this.menuDetail({ cafeId, menuId });
      if (!ok) {
        return this.commonService.errorMsg(error);
      }
      const { ok: validOk, error: validError } = this.vaildOwner(owner, cafeId);
      if (!validOk) {
        return this.commonService.errorMsg(validError);
      }
      if (nutrient) {
        const editNutrient = await this.nutrientRepository.save({
          ...menu.nutrient,
          ...nutrient,
        });
        if (!menu.nutrient) {
          menu.nutrient = editNutrient;
        }
      }
      await this.menuRepository.save({ ...menu, ...rest });
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  async deleteMenu(
    owner: User,
    { cafeId, menuId }: DeleteMenuInput,
  ): Promise<DeleteMenuOutput> {
    try {
      const { ok, error, menu } = await this.menuDetail({ cafeId, menuId });
      if (!ok) {
        return this.commonService.errorMsg(error);
      }
      const { ok: validOk, error: validError } = this.vaildOwner(owner, cafeId);
      if (!validOk) {
        return this.commonService.errorMsg(validError);
      }
      await this.menuRepository.remove(menu);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }
}
