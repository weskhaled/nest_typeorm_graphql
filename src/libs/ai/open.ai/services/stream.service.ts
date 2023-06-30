// import type { CreateCompletionResponse, OpenAIApi } from 'openai';

// import { OpenAiCompletionResponse } from '../models/open.ai.completion.response';

// export class OpenAiCompletionService {
//   private readonly DEFAULT_COMPLETION_MODEL = 'text-davinci-003';

//   private readonly DEFAULT_CODE_COMPLETION_MODEL = 'text-davinci-003';

//   private readonly MAX_TOKENS = 128;

//   private readonly MAX_CODE_COMPLETION_TOKENS = 1024;

//   constructor(private readonly service: OpenAIApi) {}

//   async textCompletion(
//     query: string,
//     modelId: string = this.DEFAULT_COMPLETION_MODEL,
//     maxTokens: number = this.MAX_TOKENS,
//   ): Promise<CreateCompletionResponse | OpenAiCompletionResponse> {
//     return this.service
//       .createCompletion({
//         prompt: query,
//         model: modelId,
//         max_tokens: maxTokens,
//       })
//       .then((response) => response.data);
//   }

//   async codeCompletion(
//     query: string,
//     modelId: string = this.DEFAULT_CODE_COMPLETION_MODEL,
//     maxTokens: number = this.MAX_CODE_COMPLETION_TOKENS,
//   ): Promise<CreateCompletionResponse | OpenAiCompletionResponse> {
//     return this.service
//       .createCompletion({
//         model: modelId,
//         max_tokens: maxTokens,
//         prompt: query,
//         // messages: [{ role: 'user', content: query }],
//         // temperature: 0,
//         // frequency_penalty: 0.0,
//         // presence_penalty: 0.0,
//       })
//       .then((response) => {

//         return response.data;
//       });
//   }
// }
import { Configuration, OpenAIApi } from "openai-edge"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

type Speaker = "bot" | "human"

export interface Speech {
  speaker: Speaker
  text: string
}

export interface Conversation {
  history: Array<Speech>
}

export interface RequestBodyPrompt {
  conversation: string
  temperature: string
}

export const HEADERS_STREAM = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "text/event-stream;charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  "X-Accel-Buffering": "no",
}

type Messages = Parameters<typeof openai.createChatCompletion>[0]["messages"]

function getMessages({
  conversation,
}: {
  conversation: Conversation
}): Messages {
  let messages: Messages = [
    { role: "system", content: "You are a helpful assistant." },
  ]
  conversation.history.forEach((speech: Speech, i) => {
    messages.push({
      role: speech.speaker === "human" ? "user" : "assistant",
      content: speech.text,
    })
  })
  return messages
}

function validateConversation(conversation: Conversation) {
  if (!conversation) {
    throw new Error("Invalid conversation")
  }
  if (!conversation.history) {
    throw new Error("Invalid conversation")
  }
}

function validateTemperature(temperature: number) {
  if (isNaN(temperature)) {
    throw new Error("Invalid temperature")
  }
  if (temperature < 0 || temperature > 1) {
    throw new Error("Invalid temperature")
  }
}

const handler = async (dto: RequestBodyPrompt) => {
  let conversation: Conversation
  let temperature: number

  try {
    conversation = JSON.parse(dto.conversation)
    temperature = parseFloat(dto.temperature)
    validateConversation(conversation)
    validateTemperature(temperature)
  } catch (e: any) {
    return new Response(
      JSON.stringify({ message: e.message || "Invalid parameter" }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      }
    )
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: getMessages({ conversation }),
      max_tokens: 1024,
      temperature,
      stream: true,
    })

    return new Response(completion.body, {
      headers: HEADERS_STREAM,
    })
  } catch (error: any) {
    console.error(error)
    if (error.response) {
      console.error(error.response.status)
      console.error(error.response.data)
    } else {
      console.error(error.message)
    }
    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    })
  }
}

export const config = {
  runtime: "edge",
}

export default handler