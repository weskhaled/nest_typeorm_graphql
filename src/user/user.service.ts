import { Injectable } from '@nestjs/common';

import { SignUpInput } from '../auth/inputs/auth.input';
import { OneRepoQuery, RepoQuery } from '../declare/types';
import { User } from './entities/user.entity';
import { CreateUserInput, UpdateUserInput } from './inputs/user.input';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getOne(qs?: OneRepoQuery<User>) {
    return this.userRepository.getOne(qs || {});
  }

  getMany(qs?: RepoQuery<User>) {
    return this.userRepository.getMany(qs || {});
  }

  async create(input: CreateUserInput | SignUpInput): Promise<User> {
    return this.userRepository.save(Object.assign(new User(), input));
  }

  createMany(input: CreateUserInput[]): Promise<User[]> {
    return this.userRepository.save(input);
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    return this.userRepository.save({ ...user, ...input });
  }

  async delete(id: string) {
    const { affected } = await this.userRepository.delete({ id });

    return affected && { status: affected > 0 ? 'success' : 'fail' };
  }
}
