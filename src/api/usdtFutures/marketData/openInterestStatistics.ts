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

export interface OpenInterestStatisticsPayload {
  symbol: string;
  period: usdtM.InterestPeriod;
  limit?: number;
  startTime?: Date | number;
  endTime?: Date | number;
}

export interface OpenInterestStatisticsResponse {
  symbol: string;
  sumOpenInterest: number;
  sumOpenInterestValue: number;
  timestamp: Date;
}

interface OpenInterestStatisticsPayloadRaw {
  symbol: string;
  period: usdtM.InterestPeriod;
  limit?: number;
  startTime?: number;
  endTime?: number;
}

interface OpenInterestStatisticsResponseRaw {
  symbol: string;
  sumOpenInterest: string;
  sumOpenInterestValue: string;
  timestamp: string;
}

export async function openInterestStatistics(client: BinanceClient, payload: OpenInterestStatisticsPayload) {
  const payloadRaw = parse<OpenInterestStatisticsPayload, OpenInterestStatisticsPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<OpenInterestStatisticsResponseRaw[]>({
    host: 'usdtM',
    path: '/futures/data/openInterestHist',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payloadRaw,
  });

  return parseArray<OpenInterestStatisticsResponseRaw, OpenInterestStatisticsResponse>(
    response,
    ({ sumOpenInterest, sumOpenInterestValue, timestamp, ...other }) => ({
      sumOpenInterest: parse(sumOpenInterest, numberParser),
      sumOpenInterestValue: parse(sumOpenInterestValue, numberParser),
      timestamp: parse(timestamp, dateParser),
      ...other,
    }),
  );
}
