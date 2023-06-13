/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionService {
  private readonly subscription: any;

  constructor(@Inject('SubscriptionProvider') subscription) {
    this.subscription = subscription;
  }

  public send(action: string, value: Record<K, V> | Array<Record<K, V>>) {
    this.subscription.publish(action, value);
  }

  public subscribeIterator(action: string) {
    return this.subscription.asyncIterator(action);
  }
}
