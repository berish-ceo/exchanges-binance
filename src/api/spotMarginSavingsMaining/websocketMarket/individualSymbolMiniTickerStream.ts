import { BinanceClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import {
  parseArray,
  parse,
  boolParser,
  regExpParser,
  stringParser,
  numberParser,
  dateParser,
} from '@berish/safe-parsing';

export interface IndividualSymbolMiniTickerStreamResponse {
  eventTime: Date;
  symbol: string;
  closePrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  totalTradedBaseAssetVolume: number;
  totalTradedQuoteAssetVolume: number;
}

export interface IndividualSymbolMiniTickerStreamResponseRaw {
  e: string;
  E: number;
  s: string;
  c: string;
  o: string;
  h: string;
  l: string;
  v: string;
  q: string;
}

export function individualSymbolMiniTickerStream(
  client: BinanceClient,
  symbol: string,
  callback: (data: IndividualSymbolMiniTickerStreamResponse, error?: any) => any,
) {
  if (!symbol) throw new TypeError('individualSymbolMiniTickerStream symbol is empty');
  if (typeof symbol !== 'string') throw new TypeError('individualSymbolMiniTickerStream symbol is not string');

  const parseCallback =
    callback &&
    ((data: IndividualSymbolMiniTickerStreamResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<IndividualSymbolMiniTickerStreamResponseRaw, IndividualSymbolMiniTickerStreamResponse>(
        data,
        ({ e, E, s, c, o, h, l, v, q, ...other }) => ({
          eventTime: parse(E, dateParser),
          symbol: s,
          closePrice: parse(c, numberParser),
          openPrice: parse(o, numberParser),
          highPrice: parse(h, numberParser),
          lowPrice: parse(l, numberParser),
          totalTradedBaseAssetVolume: parse(v, numberParser),
          totalTradedQuoteAssetVolume: parse(q, numberParser),
          ...other,
        }),
      );

      return callback(response);
    });

  return apiCall(
    { host: 'spot', path: `${symbol.toLowerCase()}@miniTicker`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
