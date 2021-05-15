import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/users/entites/user.entity';
import { Repository } from 'typeorm';
import { CafeService } from './cafes.service';
import { CreateMenuInput, CreateMenuOutput } from './dtos/create-menu.dto';
import { DeleteMenuInput, DeleteMenuOutput } from './dtos/delete-menu.dto';
import { EditMenuInput, EditMenuOutput } from './dtos/edit-menu.dto';
import { MenuDetailInput, MenuDetailOutput } from './dtos/menu-detail.dto';
import { Menu } from './entities/menu.entity';
import { Nutrient } from './entities/nutrient.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Nutrient)
    private readonly nutrientRepository: Repository<Nutrient>,
    private readonly cafeService: CafeService,
    private readonly commonService: CommonService,
  ) {}

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
      options,
    }: CreateMenuInput,
  ): Promise<CreateMenuOutput> {
    try {
      const { ok, error, cafe: findCafe } = await this.cafeService.cafeDetail({
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
      const menu = this.menuRepository.create({
        name,
        price,
        description,
        category,
        ...(menuImg && { menuImg }),
        ...(options && { options }),
      });
      const menuNutrient = await this.nutrientRepository.save(
        this.nutrientRepository.create(nutrient),
      );

      menu.nutrient = menuNutrient;
      menu.cafe = findCafe;
      menu.ownerId = owner.id;
      await this.menuRepository.save(menu);

      return {
        menuId: menu.id,
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
      const { ok, error } = await this.cafeService.cafeDetail({
        id: cafeId,
      });
      if (!ok) {
        return this.commonService.errorMsg(error);
      }
      const findMenu = await this.menuRepository.findOne(
        { id: menuId },
        { relations: ['nutrient', 'reviews'] },
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
    { cafeId, menuId, editNutrient, ...rest }: EditMenuInput,
  ): Promise<EditMenuOutput> {
    try {
      const { ok, error, menu } = await this.menuDetail({ cafeId, menuId });
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
      if (editNutrient) {
        const saveNutrient = await this.nutrientRepository.save({
          ...menu.nutrient,
          ...editNutrient,
        });
        if (!menu.nutrient) {
          menu.nutrient = saveNutrient;
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

  //메뉴 삭제
  async deleteMenu(
    owner: User,
    { cafeId, menuId }: DeleteMenuInput,
  ): Promise<DeleteMenuOutput> {
    try {
      const { ok, error, menu } = await this.menuDetail({ cafeId, menuId });
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
      await this.menuRepository.remove(menu);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return this.commonService.InternalServerErrorOutput;
    }
  }

  //매시 0분마다 별점 합산
  @Cron('0 0 * * * *')
  async menuScoreSet() {
    const menus = await this.menuRepository.find();
    menus.forEach(async (menu) => {
      let totalScore = 0;
      menu.ratings.forEach((ratings) => (totalScore += ratings.score));
      menu.totalScore = totalScore;
      menu.avgScore =
        totalScore > 0
          ? Math.floor((totalScore / menu.ratings.length) * 100) / 100
          : 0;
      await this.menuRepository.save(menu);
    });
  }
}
