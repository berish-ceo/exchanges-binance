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

export interface OpenInterestStatisticsPayload {
  pair: string;
  contractType: coinM.ContractType;
  period: coinM.InterestPeriod;
  limit?: number;
  startTime?: Date | number;
  endTime?: Date | number;
}

export interface OpenInterestStatisticsResponse {
  pair: string;
  contractType: coinM.ContractType;
  sumOpenInterest: number;
  sumOpenInterestValue: number;
  timestamp: Date;
}

interface OpenInterestStatisticsPayloadRaw {
  pair: string;
  contractType: coinM.ContractType;
  period: coinM.InterestPeriod;
  limit?: number;
  startTime?: number;
  endTime?: number;
}

interface OpenInterestStatisticsResponseRaw {
  pair: string;
  contractType: coinM.ContractType;
  sumOpenInterest: string;
  sumOpenInterestValue: string;
  timestamp: string;
}

export async function openInterestStatistics(client: BinanceKeyClient, payload: OpenInterestStatisticsPayload) {
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
    securityType: 'MARKET_DATA',

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
