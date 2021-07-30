import { BinanceClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface PartialBookDepthStreamsResponse {
  lastUpdateId: number;
  bids: { price: number; quantity: number }[];
  asks: { price: number; quantity: number }[];
}

interface PartialBookDepthStreamsResponseRaw {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export function partialBookDepthStreams(
  client: BinanceClient,
  symbol: string,
  level: 5 | 10 | 20,
  updateSpeed: '100ms' | '1000ms',
  callback: (data: PartialBookDepthStreamsResponse, error?: any) => any,
) {
  if (!symbol) throw new TypeError('partialBookDepthStreams symbol is empty');
  if (typeof symbol !== 'string') throw new TypeError('partialBookDepthStreams symbol is not string');

  if (!level) throw new TypeError('partialBookDepthStreams level is empty');
  if (level !== 5 && level !== 10 && level !== 20)
    throw new TypeError('partialBookDepthStreams level is not 5, 10 or 20');

  if (!updateSpeed) throw new TypeError('partialBookDepthStreams updateSpeed is empty');
  if (updateSpeed !== '100ms' && updateSpeed !== '1000ms')
    throw new TypeError('partialBookDepthStreams updateSpeed is not 100ms or 1000ms');

  const parseCallback =
    callback &&
    ((data: PartialBookDepthStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<PartialBookDepthStreamsResponseRaw, PartialBookDepthStreamsResponse>(
        data,
        ({ bids, asks, ...other }) => ({
          bids: parseArray(bids, ([price, quantity]) => ({
            price: parse(price, numberParser),
            quantity: parse(quantity, numberParser),
          })),
          asks: parseArray(asks, ([price, quantity]) => ({
            price: parse(price, numberParser),
            quantity: parse(quantity, numberParser),
          })),
          ...other,
        }),
      );

      return callback(response);
    });

  return apiCall(
    { host: 'spot', path: `${symbol.toLowerCase()}@depth${level}@${updateSpeed}`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
