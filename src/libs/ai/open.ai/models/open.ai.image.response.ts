import { ApiProperty } from '@nestjs/swagger';

export type ImageObject = {
  url: string;
};

export class OpenAiImageResponse {
  @ApiProperty()
  id: string;

  data: ImageObject[];
}
