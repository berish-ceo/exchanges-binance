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
import { coinM } from '../../../info';

export interface TopTraderLongShortRatioPositionsPayload {
  pair: string;
  period: coinM.InterestPeriod;
  limit?: number;
  startTime?: Date | number;
  endTime?: Date | number;
}

export interface TopTraderLongShortRatioPositionsResponse {
  pair: string;
  longShortRatio: number;
  longPosition: number;
  shortPosition: number;
  timestamp: Date;
}

interface TopTraderLongShortRatioPositionsPayloadRaw {
  pair: string;
  period: coinM.InterestPeriod;
  limit?: number;
  startTime?: number;
  endTime?: number;
}

interface TopTraderLongShortRatioPositionsResponseRaw {
  pair: string;
  longShortRatio: string;
  longPosition: string;
  shortPosition: string;
  timestamp: string;
}

export async function topTraderLongShortRatioPositions(
  client: BinanceClient,
  payload: TopTraderLongShortRatioPositionsPayload,
) {
  const payloadRaw = parse<TopTraderLongShortRatioPositionsPayload, TopTraderLongShortRatioPositionsPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<TopTraderLongShortRatioPositionsResponseRaw[]>({
    host: 'spot',
    path: '/futures/data/topLongShortPositionRatio',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payloadRaw,
  });

  return parseArray<TopTraderLongShortRatioPositionsResponseRaw, TopTraderLongShortRatioPositionsResponse>(
    response,
    ({ longShortRatio, longPosition, shortPosition, timestamp, ...other }) => ({
      longShortRatio: parse(longShortRatio, numberParser),
      longPosition: parse(longPosition, numberParser),
      shortPosition: parse(shortPosition, numberParser),
      timestamp: parse(timestamp, dateParser),
      ...other,
    }),
  );
}
