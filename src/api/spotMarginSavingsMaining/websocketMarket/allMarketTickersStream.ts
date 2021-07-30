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
import type {
  IndividualSymbolTickerStreamsResponse,
  IndividualSymbolTickerStreamsResponseRaw,
} from './individualSymbolTickerStreams';

export type AllMarketTickersStreamResponse = IndividualSymbolTickerStreamsResponse;
type AllMarketTickersStreamResponseRaw = IndividualSymbolTickerStreamsResponseRaw;

export function allMarketTickersStream(
  client: BinanceClient,
  callback: (data: AllMarketTickersStreamResponse[], error?: any) => any,
) {
  const parseCallback =
    callback &&
    ((data: AllMarketTickersStreamResponseRaw[], error?: any) => {
      if (error) return callback(void 0, error);

      const response = parseArray<AllMarketTickersStreamResponseRaw, AllMarketTickersStreamResponse>(
        data,
        ({ e, E, s, p, P, w, x, c, Q, b, B, a, A, o, h, l, v, q, O, C, F, L, n, ...other }) => ({
          eventTime: parse(E, dateParser),
          symbol: s,
          priceChange: parse(p, numberParser),
          priceChangePercent: parse(P, numberParser),
          weightedAveragePrice: parse(w, numberParser),
          firstTradeBefore24hrWindow: parse(x, numberParser),
          lastPrice: parse(c, numberParser),
          lastQuantity: parse(Q, numberParser),
          bestBidPrice: parse(b, numberParser),
          bestBidQuantity: parse(B, numberParser),
          bestAskPrice: parse(a, numberParser),
          bestAskQuantity: parse(A, numberParser),
          openPrice: parse(o, numberParser),
          highPrice: parse(h, numberParser),
          lowPrice: parse(l, numberParser),
          totalTradedBaseAssetVolume: parse(v, numberParser),
          totalTradedQuoteAssetVolume: parse(q, numberParser),
          statisticsOpenTime: parse(O, dateParser),
          statisticsCloseTime: parse(C, dateParser),
          firstTradeId: F,
          lastTradeId: L,
          totalNumberOfTrades: n,
          ...other,
        }),
      );

      return callback(response);
    });

  return apiCall({ host: 'spot', path: '!ticker@arr', securityType: 'SOCKET', client }, parseCallback);
}
