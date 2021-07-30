import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { usdtM } from '../../../info';

export interface ChangeMarginTypePayload {
  symbol: string;
  marginType: usdtM.MarginType;
}

interface ChangeMarginTypeResponseRaw {
  code: number;
  msg: string;
}

export async function changeMarginType(client: BinanceSignedClient, payload: ChangeMarginTypePayload) {
  await apiCall<ChangeMarginTypeResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/marginType',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: payload,
  });
}
