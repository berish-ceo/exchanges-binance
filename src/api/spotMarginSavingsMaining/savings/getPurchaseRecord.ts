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

export interface GetPurchaseRecordPayload<LendingType extends spot.FlexibleLendingType> {
  lendingType: LendingType;
  asset?: string;
  startTime?: Date | number;
  endTime?: Date | number;
  current?: number;
  size?: number;
}

export interface GetPurchaseRecordFlexibleResponse {
  amount: number;
  asset: string;
  createTime: Date;
  lendingType: spot.FlexibleLendingType;
  productName: string;
  purchaseId: number;
  status: string;
}
export interface GetPurchaseRecordFixedActivityResponse {
  amount: number;
  asset: string;
  createTime: Date;
  lendingType: spot.FlexibleLendingType;
  lot: number;
  productName: string;
  purchaseId: number;
  status: string;
}

interface GetPurchaseRecordPayloadRaw {
  lendingType: spot.FlexibleLendingType;
  asset?: string;
  startTime?: number;
  endTime?: number;
  current?: number;
  size?: number;
}

interface GetPurchaseRecordFlexibleResponseRaw {
  amount: string;
  asset: string;
  createTime: number;
  lendingType: spot.FlexibleLendingType;
  productName: string;
  purchaseId: number;
  status: string;
}
interface GetPurchaseRecordFixedActivityResponseRaw {
  amount: string;
  asset: string;
  createTime: number;
  lendingType: spot.FlexibleLendingType;
  lot: number;
  productName: string;
  purchaseId: number;
  status: string;
}

export async function getPurchaseRecord(
  client: BinanceSignedClient,
  payload: GetPurchaseRecordPayload<'DAILY'>,
): Promise<GetPurchaseRecordFlexibleResponse[]>;
export async function getPurchaseRecord(
  client: BinanceSignedClient,
  payload: GetPurchaseRecordPayload<'ACTIVITY' | 'CUSTOMIZED_FIXED'>,
): Promise<GetPurchaseRecordFixedActivityResponse[]>;
export async function getPurchaseRecord(
  client: BinanceSignedClient,
  payload: GetPurchaseRecordPayload<spot.FlexibleLendingType>,
): Promise<GetPurchaseRecordFlexibleResponse[] | GetPurchaseRecordFixedActivityResponse[]> {
  const payloadRaw = parse<GetPurchaseRecordPayload<spot.FlexibleLendingType>, GetPurchaseRecordPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<GetPurchaseRecordFlexibleResponseRaw[] | GetPurchaseRecordFixedActivityResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/lending/union/purchaseRecord',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  if (payload.lendingType === 'DAILY') {
    return parseArray<GetPurchaseRecordFlexibleResponseRaw, GetPurchaseRecordFlexibleResponse>(
      response as GetPurchaseRecordFlexibleResponseRaw[],
      ({ amount, createTime, ...other }) => ({
        amount: parse(amount, numberParser),
        createTime: parse(createTime, dateParser),
        ...other,
      }),
    );
  }

  return parseArray<GetPurchaseRecordFixedActivityResponseRaw, GetPurchaseRecordFixedActivityResponse>(
    response as GetPurchaseRecordFixedActivityResponseRaw[],
    ({ amount, createTime, ...other }) => ({
      amount: parse(amount, numberParser),
      createTime: parse(createTime, dateParser),
      ...other,
    }),
  );
}
