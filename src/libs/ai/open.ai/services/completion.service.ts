import type { CreateCompletionResponse, OpenAIApi } from 'openai';

import { OpenAiCompletionResponse } from '../models/open.ai.completion.response';

export class OpenAiCompletionService {
  private readonly DEFAULT_COMPLETION_MODEL = 'text-davinci-003';

  private readonly DEFAULT_CODE_COMPLETION_MODEL = 'text-davinci-003';

  private readonly MAX_TOKENS = 128;

  private readonly MAX_CODE_COMPLETION_TOKENS = 1024;

  constructor(private readonly service: OpenAIApi) {}

  async textCompletion(
    query: string,
    modelId: string = this.DEFAULT_COMPLETION_MODEL,
    maxTokens: number = this.MAX_TOKENS,
  ): Promise<CreateCompletionResponse | OpenAiCompletionResponse> {
    return this.service
      .createCompletion({
        prompt: query,
        model: modelId,
        max_tokens: maxTokens,
      })
      .then((response) => response.data);
  }

  async codeCompletion(
    query: string,
    modelId: string = this.DEFAULT_CODE_COMPLETION_MODEL,
    maxTokens: number = this.MAX_CODE_COMPLETION_TOKENS,
  ): Promise<CreateCompletionResponse | OpenAiCompletionResponse> {
    return this.service
      .createCompletion({
        model: modelId,
        max_tokens: maxTokens,
        prompt: query,
        // messages: [{ role: 'user', content: query }],
        // temperature: 0,
        // frequency_penalty: 0.0,
        // presence_penalty: 0.0,
      })
      .then((response) => {

        return response.data;
      });
  }
}
