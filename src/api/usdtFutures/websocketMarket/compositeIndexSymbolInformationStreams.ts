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

export interface CompositeIndexSymbolInformationStreamsResponse {
  eventTime: Date;
  symbol: string;
  price: number;
  composition: {
    baseAsset: string;
    weightInQuantity: number;
    weightInPercentage: number;
  }[];
}

interface CompositeIndexSymbolInformationStreamsResponseRaw {
  e: string;
  E: number;
  s: string;
  p: string;
  c: {
    b: string;
    w: string;
    W: string;
  }[];
}

export function compositeIndexSymbolInformationStreams(
  client: BinanceClient,
  symbol: string,
  callback: (data: CompositeIndexSymbolInformationStreamsResponse, error?: any) => any,
) {
  if (!symbol) throw new TypeError('compositeIndexSymbolInformationStreams symbol is empty');
  if (typeof symbol !== 'string') throw new TypeError('compositeIndexSymbolInformationStreams symbol is not string');

  const parseCallback =
    callback &&
    ((data: CompositeIndexSymbolInformationStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<
        CompositeIndexSymbolInformationStreamsResponseRaw,
        CompositeIndexSymbolInformationStreamsResponse
      >(data, ({ e, E, s, p, c, ...other }) => ({
        eventTime: parse(E, dateParser),
        symbol: s,
        price: parse(p, numberParser),
        composition: parseArray(c, ({ b, w, W, ...other }) => ({
          baseAsset: b,
          weightInQuantity: parse(w, numberParser),
          weightInPercentage: parse(W, numberParser),
          ...other,
        })),
        ...other,
      }));

      return callback(response);
    });

  return apiCall(
    { host: 'usdtM', path: `${symbol.toLowerCase()}@compositeIndex`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
