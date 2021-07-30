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
import { spot, RefType } from '../../../info';

export interface GetFixedActivityProjectPositionPayload {
  asset: string;
  projectId?: string;
  status?: RefType<spot.FlexibleProductStatusType, 'HOLDING' | 'REDEEMED'>;
}

export interface GetFixedActivityProjectPositionResponse {
  asset: string;
  canTransfer: boolean;
  createTimestamp: Date;
  duration: number;
  endTime: Date;
  interest: number;
  interestRate: number;
  lot: number;
  positionId: number;
  principal: number;
  projectId: string;
  projectName: string;
  purchaseTime: Date;
  redeemDate: Date;
  startTime: Date;
  status: spot.FlexibleProductStatusType;
  type: spot.FlexibleProductType;
}

interface GetFixedActivityProjectPositionResponseRaw {
  asset: string;
  canTransfer: boolean;
  createTimestamp: number;
  duration: number;
  endTime: number;
  interest: string;
  interestRate: string;
  lot: number;
  positionId: number;
  principal: string;
  projectId: string;
  projectName: string;
  purchaseTime: number;
  redeemDate: string;
  startTime: number;
  status: spot.FlexibleProductStatusType;
  type: spot.FlexibleProductType;
}

export async function getFixedActivityProjectPosition(
  client: BinanceSignedClient,
  payload: GetFixedActivityProjectPositionPayload,
) {
  const response = await apiCall<GetFixedActivityProjectPositionResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/lending/project/position/list',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parseArray<GetFixedActivityProjectPositionResponseRaw, GetFixedActivityProjectPositionResponse>(
    response,
    ({
      createTimestamp,
      endTime,
      interest,
      interestRate,
      principal,
      purchaseTime,
      redeemDate,
      startTime,
      ...other
    }) => ({
      createTimestamp: parse(createTimestamp, dateParser),
      endTime: parse(endTime, dateParser),
      interest: parse(interest, numberParser),
      interestRate: parse(interestRate, numberParser),
      principal: parse(principal, numberParser),
      purchaseTime: parse(purchaseTime, dateParser),
      redeemDate: parse(redeemDate, dateParser),
      startTime: parse(startTime, dateParser),
      ...other,
    }),
  );
}
