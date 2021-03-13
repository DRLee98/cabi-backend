import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Cafe } from './cafe.entity';

@InputType('KeywordInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Keyword extends CoreEntity {
  @Column({ unique: true })
  @Field((type) => String)
  @IsString()
  name: string;

  @Column({ unique: true })
  @Field((type) => String)
  @IsString()
  slug: string;

  @ManyToMany((type) => Cafe, (cafe) => cafe.keywords, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field((type) => [Cafe], { nullable: true })
  cafes?: Cafe[];
}
