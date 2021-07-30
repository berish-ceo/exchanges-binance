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

export interface GetRedemptionRecordPayload<LendingType extends spot.FlexibleLendingType> {
  lendingType: LendingType;
  asset?: string;
  startTime?: Date | number;
  endTime?: Date | number;
  current?: number;
  size?: number;
}
export interface GetRedemptionRecordFlexibleResponse {
  amount: number;
  asset: string;
  createTime: Date;
  principal: number;
  projectId: string;
  projectName: string;
  status: string;
  type: 'FAST' | 'NORMAL';
}
export interface GetRedemptionRecordFixedActivityResponse {
  amount: number;
  asset: string;
  createTime: Date;
  interest: number;
  principal: number;
  projectId: string;
  projectName: string;
  startTime: Date;
  status: string;
}

interface GetRedemptionRecordPayloadRaw {
  lendingType: spot.FlexibleLendingType;
  asset?: string;
  startTime?: number;
  endTime?: number;
  current?: number;
  size?: number;
}

interface GetRedemptionRecordFlexibleResponseRaw {
  amount: string;
  asset: string;
  createTime: number;
  principal: string;
  projectId: string;
  projectName: string;
  status: string;
  type: 'FAST' | 'NORMAL';
}
interface GetRedemptionRecordFixedActivityResponseRaw {
  amount: string;
  asset: string;
  createTime: number;
  interest: string;
  principal: string;
  projectId: string;
  projectName: string;
  startTime: number;
  status: string;
}

export async function getRedemptionRecord(
  client: BinanceSignedClient,
  payload: GetRedemptionRecordPayload<'DAILY'>,
): Promise<GetRedemptionRecordFlexibleResponse[]>;
export async function getRedemptionRecord(
  client: BinanceSignedClient,
  payload: GetRedemptionRecordPayload<'ACTIVITY' | 'CUSTOMIZED_FIXED'>,
): Promise<GetRedemptionRecordFixedActivityResponse[]>;
export async function getRedemptionRecord(
  client: BinanceSignedClient,
  payload: GetRedemptionRecordPayload<spot.FlexibleLendingType>,
): Promise<GetRedemptionRecordFlexibleResponse[] | GetRedemptionRecordFixedActivityResponse[]> {
  const payloadRaw = parse<GetRedemptionRecordPayload<spot.FlexibleLendingType>, GetRedemptionRecordPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<
    GetRedemptionRecordFlexibleResponseRaw[] | GetRedemptionRecordFixedActivityResponseRaw[]
  >({
    host: 'spot',
    path: '/sapi/v1/lending/union/redemptionRecord',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  if (payload.lendingType === 'DAILY') {
    return parseArray<GetRedemptionRecordFlexibleResponseRaw, GetRedemptionRecordFlexibleResponse>(
      response as GetRedemptionRecordFlexibleResponseRaw[],
      ({ amount, createTime, principal, ...other }) => ({
        amount: parse(amount, numberParser),
        createTime: parse(createTime, dateParser),
        principal: parse(principal, numberParser),
        ...other,
      }),
    );
  }

  return parseArray<GetRedemptionRecordFixedActivityResponseRaw, GetRedemptionRecordFixedActivityResponse>(
    response as GetRedemptionRecordFixedActivityResponseRaw[],
    ({ amount, createTime, interest, principal, startTime, ...other }) => ({
      amount: parse(amount, numberParser),
      createTime: parse(createTime, dateParser),
      interest: parse(interest, numberParser),
      principal: parse(principal, numberParser),
      startTime: parse(startTime, dateParser),
      ...other,
    }),
  );
}
