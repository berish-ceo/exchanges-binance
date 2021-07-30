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
import { usdtM } from '../../../info';

export interface LongShortRatioPayload {
  symbol: string;
  period: usdtM.InterestPeriod;
  limit?: number;
  startTime?: Date | number;
  endTime?: Date | number;
}

export interface LongShortRatioResponse {
  symbol: string;
  longShortRatio: number;
  longAccount: number;
  shortAccount: number;
  timestamp: Date;
}

interface LongShortRatioPayloadRaw {
  symbol: string;
  period: usdtM.InterestPeriod;
  limit?: number;
  startTime?: number;
  endTime?: number;
}

interface LongShortRatioResponseRaw {
  symbol: string;
  longShortRatio: string;
  longAccount: string;
  shortAccount: string;
  timestamp: string;
}

export async function longShortRatio(client: BinanceClient, payload: LongShortRatioPayload) {
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
    securityType: 'NONE',

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
