import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsNumber } from 'class-validator';

export type Speaker = "bot" | "human"

export interface Speech {
  speaker: Speaker
  text: string
}

export interface Conversation {
  history: Array<Speech>
}

export class RequestBodyPrompt {
  @IsObject()
  @ApiProperty()
  conversation: Conversation;
  @IsNumber()
  @ApiProperty()
  temperature: number;
}
