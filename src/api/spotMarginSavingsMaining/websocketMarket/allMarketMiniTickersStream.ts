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
  IndividualSymbolMiniTickerStreamResponse,
  IndividualSymbolMiniTickerStreamResponseRaw,
} from './individualSymbolMiniTickerStream';

export type AllMarketMiniTickersStreamResponse = IndividualSymbolMiniTickerStreamResponse;

type AllMarketMiniTickersStreamResponseRaw = IndividualSymbolMiniTickerStreamResponseRaw;

export function allMarketMiniTickersStream(
  client: BinanceClient,
  callback: (data: AllMarketMiniTickersStreamResponse[], error?: any) => any,
) {
  const parseCallback =
    callback &&
    ((data: AllMarketMiniTickersStreamResponseRaw[], error?: any) => {
      if (error) return callback(void 0, error);

      const response = parseArray<AllMarketMiniTickersStreamResponseRaw, AllMarketMiniTickersStreamResponse>(
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

  return apiCall({ host: 'spot', path: '!miniTicker@arr', securityType: 'SOCKET', client }, parseCallback);
}
