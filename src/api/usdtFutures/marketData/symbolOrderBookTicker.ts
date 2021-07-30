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

export interface SymbolOrderBookTickerResponse {
  symbol: string;
  bidPrice: number;
  bidQuantity: number;
  askPrice: number;
  askQuantity: number;
  time: Date;
}

interface SymbolOrderBookTickerResponseRaw {
  symbol: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  time: number;
}
export async function symbolOrderBookTicker(client: BinanceClient): Promise<SymbolOrderBookTickerResponse[]>;
export async function symbolOrderBookTicker(
  client: BinanceClient,
  symbol: string,
): Promise<SymbolOrderBookTickerResponse>;
export async function symbolOrderBookTicker(
  client: BinanceClient,
  symbol?: string,
): Promise<SymbolOrderBookTickerResponse | SymbolOrderBookTickerResponse[]> {
  const response = await apiCall<SymbolOrderBookTickerResponseRaw | SymbolOrderBookTickerResponseRaw[]>({
    host: 'usdtM',
    path: '/fapi/v1/ticker/bookTicker',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: { symbol },
  });

  return parseOptional<SymbolOrderBookTickerResponseRaw, SymbolOrderBookTickerResponse>(
    response,
    ({ bidPrice, bidQty, askPrice, askQty, time, ...other }) => ({
      bidPrice: parse(bidPrice, numberParser),
      bidQuantity: parse(bidQty, numberParser),
      askPrice: parse(askPrice, numberParser),
      askQuantity: parse(askQty, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
