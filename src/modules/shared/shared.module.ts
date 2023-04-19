import { Module } from '@nestjs/common';
import { SettingService } from './services/setting.service';
import { SubscriptionProvider } from './subscription/subscription-provider';
import { SubscriptionService } from './subscription/subscription-service';

@Module({
  providers: [SettingService, SubscriptionService, SubscriptionProvider],
  exports: [SettingService, SubscriptionService],
})
export class SharedModule {}
