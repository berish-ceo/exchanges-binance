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
        ({ e, u, s, ps, b, B, a, A, E, T, ...other }) => ({
          orderBookUpdateId: u,
          symbol: s,
          pair: ps,
          bestBidPrice: parse(b, numberParser),
          bestBidQuantity: parse(B, numberParser),
          bestAskPrice: parse(a, numberParser),
          bestAskQuantity: parse(A, numberParser),
          transactionTime: parse(T, dateParser),
          eventTime: parse(E, dateParser),
          ...other,
        }),
      );

      return callback(response);
    });

  return apiCall({ host: 'coinM', path: '!bookTicker', securityType: 'SOCKET', client }, parseCallback);
}
