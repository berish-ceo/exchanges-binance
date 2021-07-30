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
export interface MarkPriceStreamResponse {
  eventTime: Date;
  symbol: string;
  markPrice: number;
  estimatedSettlePrice: number;
  fundingRate: number;
  nextFundingTime: Date;
}

interface MarkPriceStreamResponseRaw {
  e: string;
  E: number;
  s: string;
  p: string;
  P: string;
  r: string;
  T: number;
}

export function markPriceStream(
  client: BinanceClient,
  symbol: string,
  updateSpeed: '1s' | '3s',
  callback: (data: MarkPriceStreamResponse, error?: any) => any,
) {
  if (!symbol) throw new TypeError('markPriceStream symbol is empty');
  if (typeof symbol !== 'string') throw new TypeError('markPriceStream symbol is not string');

  if (!updateSpeed) throw new TypeError('markPriceStream updateSpeed is empty');
  if (updateSpeed !== '1s' && updateSpeed !== '3s') throw new TypeError('markPriceStream updateSpeed is not 1s or 3s');

  const parseCallback =
    callback &&
    ((data: MarkPriceStreamResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<MarkPriceStreamResponseRaw, MarkPriceStreamResponse>(
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
      path: `${symbol.toLowerCase()}@markPrice${updateSpeed === '3s' ? '' : `@${updateSpeed}`}`,
      securityType: 'SOCKET',
      client,
    },
    parseCallback,
  );
}
