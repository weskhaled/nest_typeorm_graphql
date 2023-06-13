import { Repository } from 'typeorm/repository/Repository';

import { CustomRepository } from '../modules/decorators/typeorm.decorator';
import { User } from './entities/user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
