import OpenAI from 'openai';

type Role = 'system' | 'user' | 'assistant';

export type AIMessage =
  | OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam
  | { role: Role; content: string };
// | { role: 'tool'; content: string; tool_call_id: string };

export interface ToolFn<A = any, T = any> {
  (input: { userMessage: string; toolArgs: A }): Promise<T>;
}
