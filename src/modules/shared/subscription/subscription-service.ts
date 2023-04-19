import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionService {
  private readonly subscription;

  constructor(@Inject('SubscriptionProvider') subscription) {
    this.subscription = subscription;
  }
  public async send(action: string, value: object | object[]) {
    this.subscription.publish(action, value);
  }
  public async subscribeIterator(action: string) {
    return this.subscription.asyncIterator(action);
  }
}
