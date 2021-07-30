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
export interface IndexPriceStreamResponse {
  eventTime: Date;
  pair: string;
  indexPrice: number;
}

interface IndexPriceStreamResponseRaw {
  e: string;
  E: number;
  i: string;
  p: string;
}

export function indexPriceStream(
  client: BinanceClient,
  pair: string,
  updateSpeed: '1s' | '3s',
  callback: (data: IndexPriceStreamResponse, error?: any) => any,
) {
  if (!pair) throw new TypeError('indexPriceStream pair is empty');
  if (typeof pair !== 'string') throw new TypeError('indexPriceStream pair is not string');

  if (!updateSpeed) throw new TypeError('indexPriceStream updateSpeed is empty');
  if (updateSpeed !== '1s' && updateSpeed !== '3s') throw new TypeError('indexPriceStream updateSpeed is not 1s or 3s');

  const parseCallback =
    callback &&
    ((data: IndexPriceStreamResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<IndexPriceStreamResponseRaw, IndexPriceStreamResponse>(
        data,
        ({ e, E, i, p, ...other }) => ({
          eventTime: parse(E, dateParser),
          pair: i,
          indexPrice: parse(p, numberParser),
          ...other,
        }),
      );

      return callback(response);
    });

  return apiCall(
    {
      host: 'coinM',
      path: `${pair.toLowerCase()}@indexPrice${updateSpeed === '3s' ? '' : `@${updateSpeed}`}`,
      securityType: 'SOCKET',
      client,
    },
    parseCallback,
  );
}
