import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Sse,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { OpenAiCompletionResponse } from '../libs/ai/open.ai/models/open.ai.completion.response';
import { OpenAiImageResponse } from '../libs/ai/open.ai/models/open.ai.image.response';
import { OpenAiModelsList } from '../libs/ai/open.ai/models/open.ai.models.list';
import { AiService } from './ai.service';
import { RequestBodyPrompt } from './dto/chat.dto';
import { CodeCompletionDto } from './dto/code.completion.dto';
import { GenerateImageDto } from './dto/generate.image.dto';
import { TextCompletionDto } from './dto/text.completion.dto';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly service: AiService) {}

  @Get('models')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: OpenAiModelsList, isArray: true })
  @ApiOperation({
    description: 'Returns a list of available OpenAI models',
    summary: 'Get available models',
  })
  async getModels(): Promise<OpenAiModelsList[]> {
    return this.service.listModels();
  }

  @Post('completion/text')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: OpenAiCompletionResponse })
  @ApiOperation({
    description: 'Performs text completion',
    summary: 'Performs text completion',
  })
  async complete(
    @Body() dto: TextCompletionDto,
  ): Promise<OpenAiCompletionResponse> {
    return this.service.completion(dto);
  }

  @Post('completion/code')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: OpenAiCompletionResponse })
  @ApiOperation({
    description: 'Performs code completion',
    summary: 'Performs code completion',
  })
  async codeCompletion(
    @Body() dto: CodeCompletionDto,
  ): Promise<OpenAiCompletionResponse> {
    return await this.service.codeCompletion(dto);
  }

  @Post('image/create')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: OpenAiImageResponse })
  @ApiOperation({
    description: 'Generates an image from a prompt',
    summary: 'Generates an image from a prompt',
  })
  async generateImage(@Body() dto: GenerateImageDto): Promise<string[]> {
    return this.service.generateImage(dto);
  }

  @Post('chat')
  @ApiOkResponse({ type: Observable<{ data: string }> })
  @ApiOperation({
    description: 'Generates an chat with ai',
    summary: 'Generates an chat with ai',
  })
  @Sse()
  getCompletion(@Body() dto: RequestBodyPrompt) {
    return this.service.getChatCompletion(dto);
  }
}
