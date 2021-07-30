import { BinanceClient, BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import {
  parseArray,
  parse,
  boolParser,
  regExpParser,
  stringParser,
  numberParser,
  parseOptional,
  dateParser,
} from '@berish/safe-parsing';

export interface SymbolPriceTickerResponse {
  symbol: string;
  price: number;
  time: Date;
}

interface SymbolPriceTickerResponseRaw {
  symbol: string;
  price: string;
  time: number;
}

export async function symbolPriceTicker(client: BinanceClient): Promise<SymbolPriceTickerResponse[]>;
export async function symbolPriceTicker(client: BinanceClient, symbol: string): Promise<SymbolPriceTickerResponse>;
export async function symbolPriceTicker(
  client: BinanceClient,
  symbol?: string,
): Promise<SymbolPriceTickerResponse | SymbolPriceTickerResponse[]> {
  const response = await apiCall<SymbolPriceTickerResponseRaw | SymbolPriceTickerResponseRaw[]>({
    host: 'usdtM',
    path: '/fapi/v1/ticker/price',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: { symbol },
  });

  return parseOptional<SymbolPriceTickerResponseRaw, SymbolPriceTickerResponse>(
    response,
    ({ price, time, ...other }) => ({
      price: parse(price, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
