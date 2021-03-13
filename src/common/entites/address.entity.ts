import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Cafe } from 'src/cafes/entities/cafe.entity';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/users/entites/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@InputType('AddressInputType', { isAbstract: true })
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

  @OneToOne((type) => User, (user) => user.address, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  @Field((type) => User, { nullable: true })
  user?: User;

  @OneToOne((type) => Cafe, (cafe) => cafe.address, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  @Field((type) => Cafe, { nullable: true })
  cafe?: Cafe;
}
