import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface TemplatePayload {}

export interface TemplateResponse {
  coin: string;
}

interface TemplatePayloadRaw {}

interface TemplateResponseRaw {
  coin: string;
}

export async function template(client: BinanceSignedClient, payload: TemplatePayload) {
  const payloadRaw = parse<TemplatePayload, TemplatePayloadRaw>(payload, (data) => data);

  const response = await apiCall<TemplateResponseRaw>({
    host: 'spot',
    path: 'template_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<TemplateResponseRaw, TemplateResponse>(response, (data) => data);
}
