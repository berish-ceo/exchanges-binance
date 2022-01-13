import { publicCall, PublicCallOptions } from './publicCall';

export interface ApiKeyCallOptions extends PublicCallOptions {
  apiKey: string;
}

export async function apiKeyCall<Response>(options: ApiKeyCallOptions) {
  if (!options) throw new TypeError('apiKeyCall options is empty');
  if (typeof options !== 'object') throw new TypeError('apiKeyCall options is not object');

  if (!options.host) throw new TypeError('apiKeyCall options.host is empty');
  if (!options.path) throw new TypeError('apiKeyCall options.path is empty');
  if (!options.apiKey) throw new Error('apiKeyCall options.apiKey is empty');
  if (!options.method) throw new TypeError('apiKeyCall options.method is empty');

  return publicCall<Response>({
    ...options,
    headers: {
      ...options.headers,
      'X-MBX-APIKEY': options.apiKey,
    },
  });
}
