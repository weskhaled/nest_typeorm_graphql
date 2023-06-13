/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { ConfigService } from '@nestjs/config';
import {
  Args,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

import { UploadService } from './upload.service';

@ObjectType()
export class S3File {
  @Field(() => String, { nullable: false })
  url: string;

  @Field(() => String, { nullable: false })
  key: string;

  @Field(() => Number, { nullable: false })
  size: number;
}

@Resolver()
export class UploadResolver {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  @Mutation(() => String)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
  ): Promise<string> {
    const { key } = await this.uploadService.uploadFileToS3({
      folderName: 'folder',
      file,
    });

    return `https://${this.configService.get(
      'AWS_S3_BUCKET_NAME',
    )}.s3.amazonaws.com/${key}`;
  }

  @Mutation(() => [String])
  uploadFiles(
    @Args({ name: 'files', type: () => [GraphQLUpload] })
    files: FileUpload[],
  ): Promise<string[]> {
    return Promise.all(
      files.map(async (file) => {
        const { key } = await this.uploadService.uploadFileToS3({
          folderName: 'folder',
          file,
        });

        return `https://${this.configService.get(
          'AWS_S3_BUCKET_NAME',
        )}.s3.amazonaws.com/${key}`;
      }),
    );
  }

  @Mutation(() => Boolean)
  async deleteFiles(
    @Args({ name: 'keys', type: () => [String] }) keys: string[],
  ) {
    const mapped = keys.map((key) => key.split('s3.amazonaws.com/')[1]);

    for await (const key of mapped) {
      void this.uploadService.deleteS3Object(key);
    }

    return true;
  }

  @Query(() => [S3File])
  async getS3Files() {
    return await this.uploadService.listS3Object('folder');
  }
}
