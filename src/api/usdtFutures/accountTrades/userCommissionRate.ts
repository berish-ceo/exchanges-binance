import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface UserCommissionRateResponse {
  symbol: string;
  makerCommissionRate: number;
  takerCommissionRate: number;
}

interface UserCommissionRateResponseRaw {
  symbol: string;
  makerCommissionRate: string;
  takerCommissionRate: string;
}

export async function userCommissionRate(client: BinanceSignedClient, symbol: string) {
  const response = await apiCall<UserCommissionRateResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/commissionRate',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { symbol },
  });

  return parse<UserCommissionRateResponseRaw, UserCommissionRateResponse>(
    response,
    ({ makerCommissionRate, takerCommissionRate, ...other }) => ({
      makerCommissionRate: parse(makerCommissionRate, numberParser),
      takerCommissionRate: parse(takerCommissionRate, numberParser),
      ...other,
    }),
  );
}
