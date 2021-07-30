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

export type SymbolPriceTickerPayload =
  | {
      symbol?: string;
    }
  | {
      pair?: string;
    };

export interface SymbolPriceTickerResponse {
  symbol: string;
  ps: number;
  price: number;
  time: Date;
}

interface SymbolPriceTickerResponseRaw {
  symbol: string;
  ps: string;
  price: string;
  time: number;
}

export async function symbolPriceTicker(client: BinanceClient): Promise<SymbolPriceTickerResponse[]>;
export async function symbolPriceTicker(
  client: BinanceClient,
  payload: SymbolPriceTickerPayload,
): Promise<SymbolPriceTickerResponse>;
export async function symbolPriceTicker(
  client: BinanceClient,
  payload?: SymbolPriceTickerPayload,
): Promise<SymbolPriceTickerResponse | SymbolPriceTickerResponse[]> {
  const response = await apiCall<SymbolPriceTickerResponseRaw | SymbolPriceTickerResponseRaw[]>({
    host: 'usdtM',
    path: '/dapi/v1/ticker/price',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payload,
  });

  return parseOptional<SymbolPriceTickerResponseRaw, SymbolPriceTickerResponse>(
    response,
    ({ ps, price, time, ...other }) => ({
      ps: parse(ps, numberParser),
      price: parse(price, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
