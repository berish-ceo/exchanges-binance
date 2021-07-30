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

export interface MarkPriceStreamForAllmarketResponse {
  eventTime: Date;
  symbol: string;
  markPrice: number;
  indexPrice: number;
  estimatedSettlePrice: number;
  fundingRate: number;
  nextFundingTime: Date;
}

interface MarkPriceStreamForAllmarketResponseRaw {
  e: string;
  E: number;
  s: string;
  p: string;
  i: string;
  P: string;
  r: string;
  T: number;
}

export function markPriceStreamForAllmarket(
  client: BinanceClient,
  updateSpeed: '1s' | '3s',
  callback: (data: MarkPriceStreamForAllmarketResponse[], error?: any) => any,
) {
  if (!updateSpeed) throw new TypeError('markPriceStreamForAllmarket updateSpeed is empty');
  if (updateSpeed !== '1s' && updateSpeed !== '3s')
    throw new TypeError('markPriceStreamForAllmarket updateSpeed is not 1s or 3s');

  const parseCallback =
    callback &&
    ((data: MarkPriceStreamForAllmarketResponseRaw[], error?: any) => {
      if (error) return callback(void 0, error);

      const response = parseArray<MarkPriceStreamForAllmarketResponseRaw, MarkPriceStreamForAllmarketResponse>(
        data,
        ({ e, E, s, p, i, P, r, T, ...other }) => ({
          eventTime: parse(E, dateParser),
          symbol: s,
          markPrice: parse(p, numberParser),
          indexPrice: parse(i, numberParser),
          estimatedSettlePrice: parse(P, numberParser),
          fundingRate: parse(r, numberParser),
          nextFundingTime: parse(T, dateParser),
          ...other,
        }),
      );

      return callback(response);
    });

  return apiCall(
    {
      host: 'usdtM',
      path: `!markPrice@arr${updateSpeed === '1s' ? `@${updateSpeed}` : ''}`,
      securityType: 'SOCKET',
      client,
    },
    parseCallback,
  );
}
