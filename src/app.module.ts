import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { CronModule } from './cron/cron.module';
import { DeclareModule } from './declare/declare.module';
import { SettingService } from './modules/shared/services/setting.service';
import { SharedModule } from './modules/shared/shared.module';
import { PlaceModule } from './place/place.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [SharedModule],
      inject: [SettingService],
      useFactory: (settingService: SettingService) =>
        settingService.graphqlUseFactory,
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [SettingService],
      useFactory: (settingService: SettingService) =>
        settingService.typeOrmUseFactory,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    PlaceModule,
    UploadModule,
    DeclareModule,
    CronModule,
    AiModule,
  ],
})
export class AppModule {}
