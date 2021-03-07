import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Address extends CoreEntity {
  @Column()
  @Field((type) => Int)
  zipNo: number;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  roadAddr?: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  jibunAddr?: string;

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  lat?: number;

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  lng?: number;
}
