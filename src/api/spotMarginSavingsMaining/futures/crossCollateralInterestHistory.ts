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

export interface CrossCollateralInterestHistoryPayload {
  collateralCoin?: string;
  startTime?: Date | number;
  endTime?: Date | number;
  current?: number;
  limit?: number;
}

export interface CrossCollateralInterestHistoryResponse {
  rows: {
    collateralCoin: string;
    interestCoin: string;
    interest: number;
    interestFreeLimitUsed: number;
    principalForInterest: number;
    interestRate: number;
    time: Date;
  }[];
  total: number;
}

interface CrossCollateralInterestHistoryPayloadRaw {
  collateralCoin?: string;
  startTime?: number;
  endTime?: number;
  current?: number;
  limit?: number;
}

interface CrossCollateralInterestHistoryResponseRaw {
  rows: {
    collateralCoin: string;
    interestCoin: string;
    interest: string;
    interestFreeLimitUsed: string;
    principalForInterest: string;
    interestRate: string;
    time: number;
  }[];
  total: number;
}

export async function crossCollateralInterestHistory(
  client: BinanceSignedClient,
  payload?: CrossCollateralInterestHistoryPayload,
) {
  const payloadRaw = parse<CrossCollateralInterestHistoryPayload, CrossCollateralInterestHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<CrossCollateralInterestHistoryResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/interestHistory',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<CrossCollateralInterestHistoryResponseRaw, CrossCollateralInterestHistoryResponse>(
    response,
    ({ rows, ...other }) => ({
      rows: parseArray(
        rows,
        ({ interest, interestFreeLimitUsed, principalForInterest, interestRate, time, ...other }) => ({
          interest: parse(interest, numberParser),
          interestFreeLimitUsed: parse(interestFreeLimitUsed, numberParser),
          principalForInterest: parse(principalForInterest, numberParser),
          interestRate: parse(interestRate, numberParser),
          time: parse(time, dateParser),
          ...other,
        }),
      ),
      ...other,
    }),
  );
}
