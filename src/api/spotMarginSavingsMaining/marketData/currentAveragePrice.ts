import { BinanceClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface CurrentAveragePriceResponse {
  mins: number;
  price: number;
}

interface CurrentAveragePriceResponseRaw {
  mins: number;
  price: string;
}

export async function currentAveragePrice(client: BinanceClient, symbol: string) {
  const response = await apiCall<CurrentAveragePriceResponseRaw>({
    host: 'spot',
    path: '/api/v3/avgPrice',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: { symbol },
  });

  return parse<CurrentAveragePriceResponseRaw, CurrentAveragePriceResponse>(response, ({ price, ...other }) => ({
    price: parse(price, numberParser),
    ...other,
  }));
}
