import { BinanceClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
export interface IndividualSymbolBookTickerStreamsResponse {
  orderBookUpdateId: number;
  symbol: string;
  bestBidPrice: number;
  bestBidQuantity: number;
  bestAskPrice: number;
  bestAskQuantity: number;
}

export interface IndividualSymbolBookTickerStreamsResponseRaw {
  u: number;
  s: string;
  b: string;
  B: string;
  a: string;
  A: string;
}

export function individualSymbolBookTickerStreams(
  client: BinanceClient,
  symbol: string,
  callback: (data: IndividualSymbolBookTickerStreamsResponse, error?: any) => any,
) {
  if (!symbol) throw new TypeError('individualSymbolBookTickerStreams symbol is empty');
  if (typeof symbol !== 'string') throw new TypeError('individualSymbolBookTickerStreams symbol is not string');

  const parseCallback =
    callback &&
    ((data: IndividualSymbolBookTickerStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<IndividualSymbolBookTickerStreamsResponseRaw, IndividualSymbolBookTickerStreamsResponse>(
        data,
        ({ u, s, b, B, a, A, ...other }) => ({
          orderBookUpdateId: u,
          symbol: s,
          bestBidPrice: parse(b, numberParser),
          bestBidQuantity: parse(B, numberParser),
          bestAskPrice: parse(a, numberParser),
          bestAskQuantity: parse(A, numberParser),
          ...other,
        }),
      );

      return callback(response);
    });

  return apiCall(
    { host: 'spot', path: `${symbol.toLowerCase()}@bookTicker`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
