import type { OpenAIApi } from 'openai';

export class OpenAiSearchService {
  private readonly DEFAULT_SEARCH_ENGINE = 'davinci';

  constructor(private readonly service: OpenAIApi) {}

  async search(
    query: string,
    modelId: string = this.DEFAULT_SEARCH_ENGINE,
    documents: string[] = [],
  ) {
    return this.service.createSearch(modelId, {
      query: query,
      documents: documents,
    });
  }
}
