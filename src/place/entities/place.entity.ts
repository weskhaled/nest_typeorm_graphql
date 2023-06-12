import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  Relation,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Place {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  address: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.place)
  user: Relation<User>;
}

@ObjectType()
export class GetPlaceType {
  @Field(() => [Place], { nullable: true })
  data?: Place[];

  @Field(() => Number, { nullable: true })
  count?: number;
}

@ObjectType()
export class Address {
  @Field(() => String, { nullable: true })
  address?: string;
}
