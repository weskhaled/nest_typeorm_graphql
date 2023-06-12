import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OpenAiImageService } from './services/image.service';
import { OpenAiModelsList } from './models/open.ai.models.list';
import { OpenAiSearchService } from './services/search.service';
import { OpenAiCompletionService } from './services/completion.service';

import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class OpenAiService {
  private readonly client: OpenAIApi;

  public imageService: OpenAiImageService;
  public searchService: OpenAiSearchService;
  public completionService: OpenAiCompletionService;

  constructor(private readonly configService: ConfigService) {
    const configuration = new Configuration({
      apiKey: this.configService.get('OPENAI_API_KEY'),
      organization: this.configService.get('OPENAI_ORG_ID'),
    });
    console.log(this.configService.get('OPENAI_API_KEY'));
    this.client = new OpenAIApi(configuration);

    this.imageService = new OpenAiImageService(this.client);
    this.completionService = new OpenAiCompletionService(this.client);
    this.searchService = new OpenAiSearchService(this.client);
  }

  async listModels(): Promise<OpenAiModelsList[]> {
    return this.client
      .listModels()
      .then((response) => response.data)
      .then((response) => response.data);
  }
}
