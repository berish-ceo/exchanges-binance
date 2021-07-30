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

export interface MarkPriceOfAllSymbolsOfAPairResponse {
  eventTime: Date;
  symbol: string;
  markPrice: number;
  estimatedSettlePrice: number;
  fundingRate: number;
  nextFundingTime: Date;
}

interface MarkPriceOfAllSymbolsOfAPairResponseRaw {
  e: string;
  E: number;
  s: string;
  p: string;
  P: string;
  r: string;
  T: number;
}

export function markPriceOfAllSymbolsOfAPair(
  client: BinanceClient,
  pair: string,
  updateSpeed: '1s' | '3s',
  callback: (data: MarkPriceOfAllSymbolsOfAPairResponse[], error?: any) => any,
) {
  if (!pair) throw new TypeError('markPriceOfAllSymbolsOfAPair pair is empty');
  if (typeof pair !== 'string') throw new TypeError('markPriceOfAllSymbolsOfAPair pair is not string');

  if (!updateSpeed) throw new TypeError('markPriceOfAllSymbolsOfAPair updateSpeed is empty');
  if (updateSpeed !== '1s' && updateSpeed !== '3s')
    throw new TypeError('markPriceOfAllSymbolsOfAPair updateSpeed is not 1s or 3s');

  const parseCallback =
    callback &&
    ((data: MarkPriceOfAllSymbolsOfAPairResponseRaw[], error?: any) => {
      if (error) return callback(void 0, error);

      const response = parseArray<MarkPriceOfAllSymbolsOfAPairResponseRaw, MarkPriceOfAllSymbolsOfAPairResponse>(
        data,
        ({ e, E, s, p, P, r, T, ...other }) => ({
          eventTime: parse(E, dateParser),
          symbol: s,
          markPrice: parse(p, numberParser),
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
      host: 'coinM',
      path: `${pair.toLowerCase()}@markPrice${updateSpeed === '3s' ? '' : `@${updateSpeed}`}`,
      securityType: 'SOCKET',
      client,
    },
    parseCallback,
  );
}
