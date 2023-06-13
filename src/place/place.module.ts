import { Module } from '@nestjs/common';

import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { SharedModule } from '../modules/shared/shared.module';
import { PlaceRepository } from './place.repositoy';
import { PlaceResolver } from './place.resolver';
import { PlaceService } from './place.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([PlaceRepository]),
    SharedModule,
  ],
  providers: [PlaceResolver, PlaceService],
})
export class PlaceModule {}
