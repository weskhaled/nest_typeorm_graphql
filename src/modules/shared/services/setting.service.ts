import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GraphQLJSON } from 'graphql-type-json';
import { GraphQLUpload } from 'graphql-upload';
import { isNil } from 'lodash';
import { join } from 'path';

import { formatError } from '../../format/graphql-error.format';

@Injectable()
export class SettingService {
  constructor(private readonly configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get graphqlUseFactory():
    | Omit<ApolloDriverConfig, 'driver'>
    | (Promise<Omit<ApolloDriverConfig, 'driver'>> & {
        resolvers: { JSON: typeof GraphQLJSON };
      } & { cors: { origin: string; credentials: boolean } } & {
        formatError: typeof formatError;
      } & { plugins: any }) {
    return {
      uploads: false,
      resolvers: { JSON: GraphQLJSON, Upload: GraphQLUpload },
      autoSchemaFile: join(process.cwd(), 'dist/graphql-schema.gql'),
      sortSchema: true,
      playground: false,
      ...(!this.isProduction && {
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
      }),
      // context: ({ req }) => ({ req }),
      context: (context) => {
        if (context?.extra?.request) {
          return {
            req: {
              ...context?.extra?.request,
              headers: {
                ...context?.extra?.request?.headers,
                ...context?.connectionParams,
              },
            },
          };
        }

        return { req: context?.req };
      },
      introspection: true,
      subscriptions: {
        'subscriptions-transport-ws': true,
        'graphql-ws': true,
      },
      cors: {
        credentials: true,
        maxAge: 600,
        origin: [
          'http://localhost',
          'https://localhost',
          'https://vue3-urql.vercel.app',
          'https://weslati-khaled.vercel.app',
          'https://studio.apollographql.com',
        ],
      },
      cache: 'bounded',
      formatError,
    };
  }

  get typeOrmUseFactory():
    | TypeOrmModuleOptions
    | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      url: this.getString('DB_URL'),
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      // host: this.getString('DB_HOST'),
      // port: this.getNumber('DB_PORT'),
      // username: this.getString('DB_USER'),
      // password: this.getString('DB_PASSWORD'),
      // database: this.getString('DB_NAME'),
      // entities: ['dist/**/*.entity{.js}'],
      entities: ['dist/**/*.entity{.js, .ts}'],
      synchronize: true,
      autoLoadEntities: true,
      logging: true, // if you want to see the query log, change to true
      // timezone: '+09:00', // if you want to use timezone, change to your timezone
      migrationsTableName: 'migrations_typeorm',
      migrationsRun: true,
    };
  }
}
