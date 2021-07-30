import { BinanceClient, BinanceKeyClient, BinanceSignedClient } from '../../../clients';
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
import { coinM } from '../../../info';

export interface LongShortRatioPayload {
  pair: string;
  period: coinM.InterestPeriod;
  limit?: number;
  startTime?: Date | number;
  endTime?: Date | number;
}

export interface LongShortRatioResponse {
  pair: string;
  longShortRatio: number;
  longAccount: number;
  shortAccount: number;
  timestamp: Date;
}

interface LongShortRatioPayloadRaw {
  pair: string;
  period: coinM.InterestPeriod;
  limit?: number;
  startTime?: number;
  endTime?: number;
}

interface LongShortRatioResponseRaw {
  pair: string;
  longShortRatio: string;
  longAccount: string;
  shortAccount: string;
  timestamp: string;
}

export async function longShortRatio(client: BinanceKeyClient, payload: LongShortRatioPayload) {
  const payloadRaw = parse<LongShortRatioPayload, LongShortRatioPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<LongShortRatioResponseRaw[]>({
    host: 'usdtM',
    path: '/futures/data/globalLongShortAccountRatio',
    method: 'GET',
    securityType: 'MARKET_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<LongShortRatioResponseRaw, LongShortRatioResponse>(
    response,
    ({ longShortRatio, longAccount, shortAccount, timestamp, ...other }) => ({
      longShortRatio: parse(longShortRatio, numberParser),
      longAccount: parse(longAccount, numberParser),
      shortAccount: parse(shortAccount, numberParser),
      timestamp: parse(timestamp, dateParser),
      ...other,
    }),
  );
}
