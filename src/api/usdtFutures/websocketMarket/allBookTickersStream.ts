import { BinanceClient, BinanceSignedClient } from '../../../clients';
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

import type {
  IndividualSymbolBookTickerStreamsResponse,
  IndividualSymbolBookTickerStreamsResponseRaw,
} from './individualSymbolBookTickerStreams';

export type AllBookTickersStreamResponse = IndividualSymbolBookTickerStreamsResponse;

type AllBookTickersStreamResponseRaw = IndividualSymbolBookTickerStreamsResponseRaw;

export function allBookTickersStream(
  client: BinanceClient,
  callback: (data: AllBookTickersStreamResponse, error?: any) => any,
) {
  const parseCallback =
    callback &&
    ((data: AllBookTickersStreamResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<AllBookTickersStreamResponseRaw, AllBookTickersStreamResponse>(
        data,
        ({ e, u, E, T, s, b, B, a, A, ...other }) => ({
          orderBookUpdateId: u,
          eventTime: parse(E, dateParser),
          transactionTime: parse(T, dateParser),
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

  return apiCall({ host: 'usdtM', path: '!bookTicker', securityType: 'SOCKET', client }, parseCallback);
}
