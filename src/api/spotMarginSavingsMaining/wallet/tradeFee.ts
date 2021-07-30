import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface TradeFeeResponse {
  symbol: string;
  makerCommission: number;
  takerCommission: number;
}

export interface TradeFeeResponseRaw {
  symbol: string;
  makerCommission: string;
  takerCommission: string;
}

export async function tradeFee(client: BinanceSignedClient, symbol?: string) {
  const response = await apiCall<TradeFeeResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/asset/tradeFee',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { symbol },
  });

  return parseArray<TradeFeeResponseRaw, TradeFeeResponse>(
    response,
    ({ makerCommission, takerCommission, ...other }) => ({
      makerCommission: parse(makerCommission, numberParser),
      takerCommission: parse(takerCommission, numberParser),
      ...other,
    }),
  );
}
