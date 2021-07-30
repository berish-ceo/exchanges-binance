import { BinanceSignedClient } from '../../../clients';
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

export interface TopTraderLongShortRatioPositionsPayload {
  symbol: string;
  period: usdtM.InterestPeriod;
  limit?: number;
  startTime?: Date | number;
  endTime?: Date | number;
}

export interface TopTraderLongShortRatioPositionsResponse {
  symbol: string;
  longShortRatio: number;
  longAccount: number;
  shortAccount: number;
  timestamp: Date;
}

interface TopTraderLongShortRatioPositionsPayloadRaw {
  symbol: string;
  period: usdtM.InterestPeriod;
  limit?: number;
  startTime?: number;
  endTime?: number;
}

interface TopTraderLongShortRatioPositionsResponseRaw {
  symbol: string;
  longShortRatio: string;
  longAccount: string;
  shortAccount: string;
  timestamp: string;
}

export async function topTraderLongShortRatioPositions(
  client: BinanceSignedClient,
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
    path: 'topTraderLongShortRatioPositions_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<TopTraderLongShortRatioPositionsResponseRaw, TopTraderLongShortRatioPositionsResponse>(
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
