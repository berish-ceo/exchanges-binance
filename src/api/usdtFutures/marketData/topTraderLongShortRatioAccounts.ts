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

export interface TopTraderLongShortRatioAccountsPayload {
  symbol: string;
  period: usdtM.InterestPeriod;
  limit?: number;
  startTime?: Date | number;
  endTime?: Date | number;
}

export interface TopTraderLongShortRatioAccountsResponse {
  symbol: string;
  longShortRatio: number;
  longAccount: number;
  shortAccount: number;
  timestamp: Date;
}

interface TopTraderLongShortRatioAccountsPayloadRaw {
  symbol: string;
  period: usdtM.InterestPeriod;
  limit?: number;
  startTime?: number;
  endTime?: number;
}

interface TopTraderLongShortRatioAccountsResponseRaw {
  symbol: string;
  longShortRatio: string;
  longAccount: string;
  shortAccount: string;
  timestamp: string;
}

export async function topTraderLongShortRatioAccounts(
  client: BinanceClient,
  payload: TopTraderLongShortRatioAccountsPayload,
) {
  const payloadRaw = parse<TopTraderLongShortRatioAccountsPayload, TopTraderLongShortRatioAccountsPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<TopTraderLongShortRatioAccountsResponseRaw[]>({
    host: 'usdtM',
    path: '/futures/data/topLongShortAccountRatio',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payloadRaw,
  });

  return parseArray<TopTraderLongShortRatioAccountsResponseRaw, TopTraderLongShortRatioAccountsResponse>(
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
