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

export function template(
  client: BinanceSignedClient,
  payload: TemplatePayload,
  callback: (data: TemplateResponse, error?: any) => any,
) {
  const payloadRaw = parse<TemplatePayload, TemplatePayloadRaw>(payload, (data) => data);

  const parseCallback =
    callback &&
    ((data: TemplateResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<TemplateResponseRaw, TemplateResponse>(data, (data) => data);

      return callback(response);
    });

  return apiCall({ host: 'spot', path: 'template_path', securityType: 'SOCKET', client }, parseCallback);
}
