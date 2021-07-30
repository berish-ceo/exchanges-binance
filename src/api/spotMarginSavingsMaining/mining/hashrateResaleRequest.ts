import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface HashrateResaleRequestPayload {
  userName: string;
  algo: string;
  toPoolUser: string;
  hashRate: number;
  startDate?: Date | number;
  endDate?: Date | number;
}

export type HashrateResaleRequestResponse = number;

interface HashrateResaleRequestPayloadRaw {
  userName: string;
  algo: string;
  toPoolUser: string;
  hashRate: number;
  startDate?: number;
  endDate?: number;
}

interface HashrateResaleRequestResponseRaw {
  code: number;
  msg: string;
  data: number;
}

export async function hashrateResaleRequest(client: BinanceSignedClient, payload: HashrateResaleRequestPayload) {
  const payloadRaw = parse<HashrateResaleRequestPayload, HashrateResaleRequestPayloadRaw>(
    payload,
    ({ startDate, endDate, ...other }) => ({
      startDate: parse(startDate, numberParser),
      endDate: parse(endDate, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<HashrateResaleRequestResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/mining/hash-transfer/config',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<HashrateResaleRequestResponseRaw, HashrateResaleRequestResponse>(response, ({ data }) =>
    parse(data, numberParser),
  );
}
