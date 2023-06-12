import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JwtWithUser, Token } from './entities/auth._entity';
import { AuthService } from './auth.service';
import {
  SignInInput,
  SignUpInput,
  RefreshTokenInput,
} from '../auth/inputs/auth.input';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../modules/decorators/user.decorator';
import { SignInGuard } from '../modules/guards/graphql-signin-guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => JwtWithUser)
  @UseGuards(SignInGuard)
  signIn(@CurrentUser() user: User, @Args('input') _: SignInInput) {
    return this.authService.signIn(user);
  }

  @Mutation(() => JwtWithUser, {
    description:
      'Before you start to sign up, you have to set private key and public key in .env',
  })
  signUp(@Args('input') input: SignUpInput) {
    return this.authService.signUp(input);
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.authService.refreshToken(token);
  }
}
