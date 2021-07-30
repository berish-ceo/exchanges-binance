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
        ({ e, E, s, ps, c, o, h, l, v, q, ...other }) => ({
          eventTime: parse(E, dateParser),
          symbol: s,
          pair: ps,
          closePrice: parse(c, numberParser),
          openPrice: parse(o, numberParser),
          highPrice: parse(h, numberParser),
          lowPrice: parse(l, numberParser),
          totalTradedVolume: parse(v, numberParser),
          totalTradedBaseAssetVolume: parse(q, numberParser),
          ...other,
        }),
      );

      return callback(response);
    });

  return apiCall({ host: 'coinM', path: '!miniTicker@arr', securityType: 'SOCKET', client }, parseCallback);
}
