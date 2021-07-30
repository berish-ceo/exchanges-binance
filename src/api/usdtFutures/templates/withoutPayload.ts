import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface TemplateResponse {
  coin: string;
}

interface TemplateResponseRaw {
  coin: string;
}

export async function template(client: BinanceSignedClient) {
  const response = await apiCall<TemplateResponseRaw>({
    host: 'spot',
    path: 'template_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parse<TemplateResponseRaw, TemplateResponse>(response, (data) => data);
}
