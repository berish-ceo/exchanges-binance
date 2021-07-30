import { BinanceClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import {
  parseArray,
  parse,
  boolParser,
  regExpParser,
  stringParser,
  numberParser,
  parseOptional,
} from '@berish/safe-parsing';

export interface SymbolPriceTickerResponse {
  symbol: string;
  price: number;
}

interface SymbolPriceTickerResponseRaw {
  symbol: string;
  price: string;
}

export async function symbolPriceTicker(client: BinanceClient): Promise<SymbolPriceTickerResponse[]>;
export async function symbolPriceTicker(client: BinanceClient, symbol: string): Promise<SymbolPriceTickerResponse>;
export async function symbolPriceTicker(client: BinanceClient, symbol?: string) {
  const response = await apiCall<SymbolPriceTickerResponseRaw | SymbolPriceTickerResponseRaw[]>({
    host: 'spot',
    path: '/api/v3/ticker/price',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: { symbol },
  });

  return parseOptional<SymbolPriceTickerResponseRaw, SymbolPriceTickerResponse>(response, ({ price, ...other }) => ({
    price: parse(price, numberParser),
    ...other,
  }));
}
