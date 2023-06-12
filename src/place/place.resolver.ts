import { UseGuards } from '@nestjs/common';
import GraphQLJSON from 'graphql-type-json';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { GetManyInput, GetOneInput } from '../declare/inputs/custom.input';

import { GraphqlPassportAuthGuard } from '../modules/guards/graphql-passport-auth.guard';
import { SubscriptionService } from '../modules/shared/subscription/subscription-service';
import { GetPlaceType, Place } from './entities/place.entity';
import { CreatePlaceInput, UpdatePlaceInput } from './inputs/place.input';
import { PlaceService } from './place.service';

@Resolver()
export class PlaceResolver {
  constructor(
    private readonly placeService: PlaceService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Query(() => GetPlaceType)
  @UseGuards(new GraphqlPassportAuthGuard(['admin', 'user']))
  getManyPlaces(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Place>,
  ) {
    return this.placeService.getMany(qs);
  }

  @Query(() => [String])
  @UseGuards(new GraphqlPassportAuthGuard(['user', 'admin']))
  async getAddress() {
    return (await this.placeService.getAddress()).map((item) => item.address);
  }

  @Query(() => Place)
  @UseGuards(new GraphqlPassportAuthGuard(['user', 'admin']))
  getOnePlace(
    @Args({ name: 'input', nullable: true })
    qs: GetOneInput<Place>,
  ) {
    return this.placeService.getOne(qs);
  }

  @Mutation(() => Place)
  @UseGuards(new GraphqlPassportAuthGuard(['user', 'admin']))
  async createPlace(@Args('input') input: CreatePlaceInput) {
    const newPlace = await this.placeService.create(input);
    const newPlaceInserted = await this.placeService.getOne({
      where: { id: newPlace.id },
      relations: ['user'],
    });
    this.subscriptionService.send('listenForNewPlace', newPlaceInserted);
    return newPlace;
  }

  @Mutation(() => [Place])
  @UseGuards(new GraphqlPassportAuthGuard(['user', 'admin']))
  createManyPlaces(
    @Args({ name: 'input', type: () => [CreatePlaceInput] })
    input: CreatePlaceInput[],
  ) {
    return this.placeService.createMany(input);
  }

  @Mutation(() => Place)
  @UseGuards(new GraphqlPassportAuthGuard(['user', 'admin']))
  updatePlace(@Args('id') id: number, @Args('input') input: UpdatePlaceInput) {
    return this.placeService.update(id, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard(['user', 'admin']))
  deletePlace(@Args('id') id: number) {
    return this.placeService.delete(id);
  }

  @UseGuards(new GraphqlPassportAuthGuard(['user', 'admin']))
  @Subscription(() => Place, { resolve: (data) => data })
  public listenForNewPlace() {
    return this.subscriptionService.subscribeIterator('listenForNewPlace');
  }
}
