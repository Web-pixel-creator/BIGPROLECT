import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class ModelScopeProvider extends BaseProvider {
  name = 'ModelScope';
  getApiKeyLink = 'https://modelscope.cn/my/overview';

  config = {
    apiTokenKey: 'MODELSCOPE_API_KEY',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'iic/QwenLong-L1.5-30B-A3B',
      label: 'Qwen Long (30B)',
      provider: 'ModelScope',
      maxTokenAllowed: 128000,
    },
    {
      name: 'Qwen/Qwen2.5-72B-Instruct',
      label: 'Qwen 2.5 (72B)',
      provider: 'ModelScope',
      maxTokenAllowed: 128000,
    },
  ];

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    let { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'MODELSCOPE_API_KEY',
    });

    // Fallback for local development where serverEnv might be empty
    if (!apiKey && typeof process !== 'undefined' && process.env) {
      apiKey = process.env.MODELSCOPE_API_KEY;
    }

    if (apiKey) {
      apiKey = apiKey.trim().replace(/[\r\n]/g, '');
    }

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const openai = createOpenAI({
      baseURL: 'https://api-inference.modelscope.cn/v1',
      apiKey,
    });

    return openai(model);
  }
}
