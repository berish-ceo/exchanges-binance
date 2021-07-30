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
import { spot } from '../../../info';

export interface GetInterestHistoryPayload {
  lendingType: spot.FlexibleLendingType;
  asset?: string;
  startTime?: Date | number;
  endTime?: Date | number;
  current?: number;
  size?: number;
}

export interface GetInterestHistoryResponse {
  asset: string;
  interest: number;
  lendingType: spot.FlexibleLendingType;
  productName: string;
  time: Date;
}

interface GetInterestHistoryPayloadRaw {
  lendingType: spot.FlexibleLendingType;
  asset?: string;
  startTime?: number;
  endTime?: number;
  current?: number;
  size?: number;
}

interface GetInterestHistoryResponseRaw {
  asset: string;
  interest: string;
  lendingType: spot.FlexibleLendingType;
  productName: string;
  time: number;
}

export async function getInterestHistory(client: BinanceSignedClient, payload: GetInterestHistoryPayload) {
  const payloadRaw = parse<GetInterestHistoryPayload, GetInterestHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<GetInterestHistoryResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/lending/union/interestHistory',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<GetInterestHistoryResponseRaw, GetInterestHistoryResponse>(
    response,
    ({ interest, time, ...other }) => ({
      interest: parse(interest, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
