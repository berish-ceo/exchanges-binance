import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { coinM } from '../../../info';

export interface ChangeMarginTypePayload {
  symbol: string;
  marginType: coinM.MarginType;
}

export interface ChangeMarginTypeResponse {
  code: number;
  msg: string;
}

export async function changeMarginType(client: BinanceSignedClient, payload: ChangeMarginTypePayload) {
  const response = await apiCall<ChangeMarginTypeResponse>({
    host: 'spot',
    path: '/dapi/v1/marginType',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: payload,
  });

  return response;
}
