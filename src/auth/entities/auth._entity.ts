import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { GraphQLJWT } from 'graphql-scalars';

@ObjectType()
export class JwtWithUser {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class Token {
  @Field(() => GraphQLJWT, { description: 'JWT access token' })
  accessToken: string;

  @Field(() => GraphQLJWT, { description: 'JWT refresh token' })
  refreshToken: string;
}
