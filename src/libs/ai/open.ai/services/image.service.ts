import type { ImagesResponse, OpenAIApi } from 'openai';
import {
  CreateImageRequestResponseFormatEnum,
  CreateImageRequestSizeEnum,
} from 'openai';

import { OpenAiImageResponse } from '../models/open.ai.image.response';

export class OpenAiImageService {
  private readonly DEFAULT_NUMBER_OF_VARIATIONS = 1;

  private readonly DEFAULT_IMAGE_SIZE = CreateImageRequestSizeEnum._1024x1024;

  private readonly DEFAULT_RESPONSE_FORMAT =
    CreateImageRequestResponseFormatEnum.Url;

  constructor(private readonly service: OpenAIApi) {}

  async create(
    query: string,
    size = this.DEFAULT_IMAGE_SIZE,
    variations: number = this.DEFAULT_NUMBER_OF_VARIATIONS,
  ): Promise<ImagesResponse | OpenAiImageResponse> {
    return this.service
      .createImage({
        size: size,
        prompt: query,
        n: variations,
        response_format: this.DEFAULT_RESPONSE_FORMAT,
      })
      .then((response) => response.data);
  }

  async edit(
    image: File,
    mask: File,
    query: string,
    size: string = this.DEFAULT_IMAGE_SIZE,
    variations: number = this.DEFAULT_NUMBER_OF_VARIATIONS,
  ): Promise<ImagesResponse | OpenAiImageResponse> {
    return this.service
      .createImageEdit(
        image,
        query,
        mask,
        variations,
        size,
        this.DEFAULT_RESPONSE_FORMAT,
      )
      .then((response) => response.data);
  }
}
