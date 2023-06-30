import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  CreateChatCompletionResponse,
  CreateCompletionResponse,
} from 'openai';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { Observable } from 'rxjs';

import { OpenAiCompletionResponse } from '../libs/ai/open.ai/models/open.ai.completion.response';
import { OpenAiService } from '../libs/ai/open.ai/open.ai.service';
import { Conversation, RequestBodyPrompt, Speech } from './dto/chat.dto';
import { CodeCompletionDto } from './dto/code.completion.dto';
import { GenerateImageDto } from './dto/generate.image.dto';
import { TextCompletionDto } from './dto/text.completion.dto';

type Messages = ChatCompletionRequestMessage[];

function getMessages({
  conversation,
}: {
  conversation: Conversation;
}): Messages {
  const messages: Messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
  ];
  conversation.history.forEach((speech: Speech, i) => {
    messages.push({
      role: speech.speaker === 'human' ? 'user' : 'assistant',
      content: speech.text,
    });
  });

  return messages;
}

@Injectable()
export class AiService {
  configuration = new Configuration({
    apiKey: this.configService.get('OPENAI_API_KEY'),
    organization: this.configService.get('OPENAI_ORG_ID'),
  });

  private openai = new OpenAIApi(this.configuration);

  constructor(
    private readonly configService: ConfigService,
    private readonly openAiService: OpenAiService,
  ) {}

  async listModels() {
    return this.openAiService.listModels();
  }

  async completion(
    dto: TextCompletionDto,
  ): Promise<OpenAiCompletionResponse | CreateCompletionResponse> {
    return this.openAiService.completionService.textCompletion(dto.prompt);
  }

  async codeCompletion(
    dto: CodeCompletionDto,
  ): Promise<OpenAiCompletionResponse | CreateCompletionResponse> {
    return this.openAiService.completionService.codeCompletion(dto.prompt);
  }

  getChatCompletion(dto: RequestBodyPrompt): Observable<{ data: string }> {
    const conversation = dto.conversation;
    const temperature = dto.temperature;

    return new Observable((subscriber) => {
      this.openai
        .createChatCompletion(
          {
            model: 'gpt-3.5-turbo',
            messages: getMessages({ conversation }),
            max_tokens: 1024,
            temperature,
            stream: true,
          },
          { responseType: 'stream' },
        )
        .then((res) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          res.data.on('data', (chunk) => {
            try {
              if (chunk?.toString().match(/^\{\n\s+\"error\"\:/)) {
                console.error('getStream error:', chunk.toString());
                subscriber.complete();

                return;
              }

              const lines = chunk?.toString()?.split('data: ') || [];
              lines.shift();

              for (const line of lines) {
                if (line.trim() === '[DONE]') {
                  subscriber.complete();

                  return;
                }

                const data = line
                  .toString()
                  .replace('data:', '')
                  .replace('[DONE]', '')
                  .replace('data: [DONE]', '')
                  .trim();

                if (data) {
                  subscriber.next({ data });
                }
              }
            } catch (e) {
              subscriber.complete();
              console.error(
                'getStream handle chunk error:',
                e,
                chunk.toString(),
              );
            }
          });
          res.data.on('end', () => {
            subscriber.complete();
          });
          res.data.on('error', () => {
            subscriber.complete();
          });
        })
        .catch((error) => {
          console.error('getStream error:', error);
          subscriber.complete();
        });
    });
  }

  async generateImage(dto: GenerateImageDto): Promise<string[]> {
    return this.openAiService.imageService
      .create(dto.prompt)
      .then((response) => response.data.map((item) => item.url))
      .catch(() => []);
  }
}
