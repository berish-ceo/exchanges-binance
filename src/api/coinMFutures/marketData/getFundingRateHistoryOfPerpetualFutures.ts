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

export interface GetFundingRateHistoryOfPerpetualFuturesPayload {
  symbol: string;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface GetFundingRateHistoryOfPerpetualFuturesResponse {
  symbol: string;
  fundingTime: Date;
  fundingRate: number;
}

interface GetFundingRateHistoryOfPerpetualFuturesPayloadRaw {
  symbol: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface GetFundingRateHistoryOfPerpetualFuturesResponseRaw {
  symbol: string;
  fundingTime: number;
  fundingRate: string;
}

export async function getFundingRateHistoryOfPerpetualFutures(
  client: BinanceClient,
  payload: GetFundingRateHistoryOfPerpetualFuturesPayload,
) {
  const payloadRaw = parse<
    GetFundingRateHistoryOfPerpetualFuturesPayload,
    GetFundingRateHistoryOfPerpetualFuturesPayloadRaw
  >(payload, ({ startTime, endTime, ...other }) => ({
    startTime: parse(startTime, numberParser),
    endTime: parse(endTime, numberParser),
    ...other,
  }));

  const response = await apiCall<GetFundingRateHistoryOfPerpetualFuturesResponseRaw[]>({
    host: 'spot',
    path: '/dapi/v1/fundingRate',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payloadRaw,
  });

  return parseArray<
    GetFundingRateHistoryOfPerpetualFuturesResponseRaw,
    GetFundingRateHistoryOfPerpetualFuturesResponse
  >(response, ({ fundingRate, fundingTime, ...other }) => ({
    fundingRate: parse(fundingRate, numberParser),
    fundingTime: parse(fundingTime, dateParser),
    ...other,
  }));
}
