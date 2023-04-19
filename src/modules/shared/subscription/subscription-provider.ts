import { PubSub } from 'graphql-subscriptions';

// tslint:disable-next-line: variable-name
export const SubscriptionProvider = {
  provide: 'SubscriptionProvider',
  useFactory: () => {
    const subscription = new PubSub();
    return subscription;
  },
};
