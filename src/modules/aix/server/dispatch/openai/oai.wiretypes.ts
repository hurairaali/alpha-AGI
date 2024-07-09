import { z } from 'zod';

//
// Implementation notes:
// - 2024-07-09: skipping Functions as they're deprecated
// - 2024-07-09: ignoring logprobs
// - 2024-07-09: ignoring the advanced model configuration
//


/// Content parts - Input

const openaiWire_TextContentPart_Schema = z.object({
  type: z.literal('text'),
  text: z.string(),
});

const openaiWire_ImageContentPart_Schema = z.object({
  type: z.literal('image_url'),
  image_url: z.object({
    // Either a URL of the image or the base64 encoded image data.
    url: z.string(),
    // Control how the model processes the image and generates its textual understanding.
    // https://platform.openai.com/docs/guides/vision/low-or-high-fidelity-image-understanding
    detail: z.enum(['auto', 'low', 'high']).optional(),
  }),
});

const openaiWire_ContentPart_Schema = z.discriminatedUnion('type', [
  openaiWire_TextContentPart_Schema,
  openaiWire_ImageContentPart_Schema,
]);


/// Content parts - Output

const openaiWire_PredictedFunctionCall_Schema = z.object({
  type: z.literal('function'),
  id: z.string(),
  function: z.object({
    name: z.string(),
    /**
     * Note that the model does not always generate valid JSON, and may hallucinate parameters
     * not defined by your function schema.
     * Validate the arguments in your code before calling your function.
     */
    arguments: z.string(),
  }),
});


// Messages - Input

const _optionalParticipantName = z.string().optional();

const openaiWire_SystemMessage_Schema = z.object({
  role: z.literal('system'),
  content: z.string(),
  name: _optionalParticipantName,
});

const openaiWire_UserMessage_Schema = z.object({
  role: z.literal('user'),
  content: z.union([z.string(), z.array(openaiWire_ContentPart_Schema)]),
  name: _optionalParticipantName,
});

const openaiWire_AssistantMessage_Schema = z.object({
  role: z.literal('assistant'),
  /**
   * The contents of the assistant message. Required unless tool_calls or function_call is specified.
   */
  content: z.string().nullable(),
  /**
   * The tool calls generated by the model, such as function calls.
   */
  tool_calls: z.array(openaiWire_PredictedFunctionCall_Schema).optional(),
  // tool_calls: z.array(openaiWire_ToolCall_Schema).optional(),
  name: _optionalParticipantName,
});

const openaiWire_ToolMessage_Schema = z.object({
  role: z.literal('tool'),
  content: z.string(),
  tool_call_id: z.string(),
});

const openaiWire_Message_Schema = z.discriminatedUnion('role', [
  openaiWire_SystemMessage_Schema,
  openaiWire_UserMessage_Schema,
  openaiWire_AssistantMessage_Schema,
  openaiWire_ToolMessage_Schema,
]);


/// Tool definitions - Input

const openaiWire_FunctionDefinition_Schema = z.object({
  /**
   * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.
   */
  name: z.string(),
  /**
   * A description of what the function does, used by the model to choose when and how to call the function.
   */
  description: z.string().optional(),
  /**
   * The parameters the functions accepts, described as a JSON Schema object.
   * Omitting parameters defines a function with an empty parameter list.
   */
  parameters: z.record(z.unknown()).optional(),
});

const openaiWire_ToolDefinition_Schema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('function'),
    function: openaiWire_FunctionDefinition_Schema,
  }),
]);

const openaiWire_ToolChoice_Schema = z.union([
  z.literal('none'), // Do not use any tools
  z.literal('auto'), // Let the model decide whether to use tools or generate content
  z.literal('required'), // Must call one or more
  z.object({
    type: z.literal('function'),
    function: z.object({ name: z.string() }),
  }),
]);


/// API: Content Generation - Request

export type OpenaiWire_ChatCompletionRequest = z.infer<typeof openaiWire_chatCompletionRequest_Schema>;
export const openaiWire_chatCompletionRequest_Schema = z.object({
  // basic input
  model: z.string(),
  messages: z.array(openaiWire_Message_Schema),

  // tool definitions and calling policy
  tools: z.array(openaiWire_ToolDefinition_Schema).optional(),
  tool_choice: openaiWire_ToolChoice_Schema.optional(),
  parallel_tool_calls: z.boolean().optional(),

  // common model configuration
  max_tokens: z.number().optional(),
  temperature: z.number().min(0).max(2).optional(),

  // other model configuration
  stream: z.boolean().optional(), // If set, partial message deltas will be sent, with the stream terminated by a `data: [DONE]` message.
  stream_options: z.object({
    include_usage: z.boolean().optional(), // If set, an additional chunk will be streamed with a 'usage' field on the entire request.
  }).optional(),
  response_format: z.object({
    type: z.enum([
      // default
      'text',

      /**
       * When using JSON mode, you must also instruct the model to produce JSON
       * yourself via a system or user message. Without this, the model may generate
       * an unending stream of whitespace until the generation reaches the token limit,
       * resulting in a long-running and seemingly "stuck" request.
       *
       * Also note that the message content may be partially cut off if
       * finish_reason="length", which indicates the generation exceeded max_tokens or
       * the conversation exceeded the max context length.
       */
      'json_object',
    ]),
  }).optional(),
  seed: z.number().int().optional(),
  stop: z.array(z.string()).optional(), // Up to 4 sequences where the API will stop generating further tokens.
  user: z.string().optional(),

  // (disabled) advanced model configuration
  // frequency_penalty: z.number().min(-2).max(2).optional(),
  // presence_penalty: z.number().min(-2).max(2).optional(),
  // logit_bias: z.record(z.number()).optional(),
  // logprobs: z.boolean().optional(),
  // top_logprobs: z.number().int().min(0).max(20).optional(),
  // top_p: z.number().min(0).max(1).optional(),

  // (disabled) advanced API configuration
  // n: z.number().int().positive().optional(), // defaulting 'n' to 1, as the derived-ecosystem does not support it
  // service_tier: z.unknown().optional(),

});


/// API: Content Generation - Output

const openaiWire_FinishReason_Enum = z.enum([
  'stop', // natural completion, or stop sequence hit
  'length', // max_tokens exceeded
  'tool_calls', // the model called a tool
  'content_filter', // upstream content filter stopped the generation
]);

const openaiWire_Usage_Schema = z.object({
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number(),
});


const openaiWire_UndocumentedError_Schema = z.object({
  // (undocumented) first experienced on 2023-06-19 on streaming APIs
  message: z.string().optional(),
  type: z.string().optional(),
  param: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
});

const openaiWire_UndocumentedWarning_Schema = z.string();


const openaiWire_ChatCompletionChoice_Schema = z.object({
  index: z.number(),

  // NOTE: the OpenAI api does not force role: 'assistant', it's only induced
  // We recycle the assistant message response here, with either content or tool_calls
  message: openaiWire_AssistantMessage_Schema,

  finish_reason: openaiWire_FinishReason_Enum,
  // logprobs: ... // Log probability information for the choice.
});

export type OpenaiWire_ChatCompletionResponse = z.infer<typeof openaiWire_chatCompletionResponse_Schema>;
export const openaiWire_chatCompletionResponse_Schema = z.object({
  object: z.literal('chat.completion'),
  id: z.string(), // A unique identifier for the chat completion.

  /**
   * A list of chat completion choices. Can be more than one if n is greater than 1.
   */
  choices: z.array(openaiWire_ChatCompletionChoice_Schema),

  model: z.string(), // The model used for the chat completion.
  usage: openaiWire_Usage_Schema.optional(), // If requested
  created: z.number(), // The Unix timestamp (in seconds) of when the chat completion was created.
  system_fingerprint: z.string().optional(), // The backend configuration that the model runs with.
  // service_tier: z.unknown().optional(),
});


/// API: Content Generation - Output - Chunks

const openaiWire_ChatCompletionChunkDelta_Schema = z.object({
  role: z.literal('assistant').optional(),
  content: z.string().nullable().optional(),
  tool_calls: z.array(openaiWire_PredictedFunctionCall_Schema).optional(),
});

const openaiWire_ChatCompletionChunkChoice_Schema = z.object({
  index: z.number(),

  // A chat completion delta generated by streamed model responses.
  delta: openaiWire_ChatCompletionChunkDelta_Schema,

  finish_reason: openaiWire_FinishReason_Enum.nullable(),
  // logprobs: ... // Log probability information for the choice.
});

export type OpenaiWire_ChatCompletionChunkResponse = z.infer<typeof openaiWire_ChatCompletionChunkResponse_Schema>;
export const openaiWire_ChatCompletionChunkResponse_Schema = z.object({
  object: z.enum(['chat.completion.chunk', '' /* [Azure] bad response */]),
  id: z.string(),

  /**
   * A list of chat completion choices.
   * Can contain more than one elements if n is greater than 1.
   * Can also be empty for the last chunk if you set stream_options: {"include_usage": true}
   */
  choices: z.array(openaiWire_ChatCompletionChunkChoice_Schema),

  model: z.string(), // The model used for the chat completion.
  usage: openaiWire_Usage_Schema.optional(), // If requested
  created: z.number(), // The Unix timestamp (in seconds) of when the chat completion was created.
  system_fingerprint: z.string().optional(), // The backend configuration that the model runs with.
  // service_tier: z.unknown().optional(),

  // undocumented streaming messages
  error: openaiWire_UndocumentedError_Schema.optional(),
  warning: openaiWire_UndocumentedWarning_Schema.optional(),
});