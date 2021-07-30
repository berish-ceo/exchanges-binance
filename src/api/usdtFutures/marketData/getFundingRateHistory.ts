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

export interface GetFundingRateHistoryPayload {
  symbol?: string;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface GetFundingRateHistoryResponse {
  symbol: string;
  fundingRate: number;
  fundingTime: Date;
}

interface GetFundingRateHistoryPayloadRaw {
  symbol?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface GetFundingRateHistoryResponseRaw {
  symbol: string;
  fundingRate: string;
  fundingTime: number;
}

export async function getFundingRateHistory(client: BinanceClient, payload?: GetFundingRateHistoryPayload) {
  const payloadRaw = parse<GetFundingRateHistoryPayload, GetFundingRateHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<GetFundingRateHistoryResponseRaw[]>({
    host: 'usdtM',
    path: '/fapi/v1/fundingRate',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payloadRaw,
  });

  return parseArray<GetFundingRateHistoryResponseRaw, GetFundingRateHistoryResponse>(
    response,
    ({ fundingRate, fundingTime, ...other }) => ({
      fundingRate: parse(fundingRate, numberParser),
      fundingTime: parse(fundingTime, dateParser),
      ...other,
    }),
  );
}
