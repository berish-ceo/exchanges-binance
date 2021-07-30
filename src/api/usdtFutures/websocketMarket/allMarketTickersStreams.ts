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

export type AllMarketTickersStreamsResponse = IndividualSymbolTickerStreamsResponse;

type AllMarketTickersStreamsResponseRaw = IndividualSymbolTickerStreamsResponseRaw;

export function allMarketTickersStreams(
  client: BinanceClient,
  callback: (data: AllMarketTickersStreamsResponse[], error?: any) => any,
) {
  const parseCallback =
    callback &&
    ((data: AllMarketTickersStreamsResponseRaw[], error?: any) => {
      if (error) return callback(void 0, error);

      const response = parseArray<AllMarketTickersStreamsResponseRaw, AllMarketTickersStreamsResponse>(
        data,
        ({ e, E, s, p, P, w, c, Q, o, h, l, v, q, O, C, F, L, n, ...other }) => ({
          eventTime: parse(E, dateParser),
          symbol: s,
          priceChange: parse(p, numberParser),
          priceChangePercent: parse(P, numberParser),
          weightedAveragePrice: parse(w, numberParser),
          lastPrice: parse(c, numberParser),
          lastQuantity: parse(Q, numberParser),
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

  return apiCall({ host: 'usdtM', path: '!ticker@arr', securityType: 'SOCKET', client }, parseCallback);
}
