import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { spot } from '../../../info';

export interface GetFixedAndActivityProjectListPayload {
  type: spot.FlexibleProductType;
  asset?: string;
  status?: spot.FlexibleProductStatusType;
  isSortAsc?: boolean;
  sortBy?: spot.FlexibleSortByType;
  current?: number;
  size?: number;
}

export interface GetFixedAndActivityProjectListResponse {
  asset: string;
  displayPriority: number;
  duration: number;
  interestPerLot: number;
  interestRate: number;
  lotSize: number;
  lotsLowLimit: number;
  lotsPurchased: number;
  lotsUpLimit: number;
  maxLotsPerUser: number;
  needKyc: boolean;
  projectId: string;
  projectName: string;
  status: spot.FlexibleProductStatusType;
  type: spot.FlexibleProductType;
  withAreaLimitation: boolean;
}

interface GetFixedAndActivityProjectListResponseRaw {
  asset: string;
  displayPriority: number;
  duration: number;
  interestPerLot: string;
  interestRate: string;
  lotSize: string;
  lotsLowLimit: number;
  lotsPurchased: number;
  lotsUpLimit: number;
  maxLotsPerUser: number;
  needKyc: boolean;
  projectId: string;
  projectName: string;
  status: spot.FlexibleProductStatusType;
  type: spot.FlexibleProductType;
  withAreaLimitation: boolean;
}

export async function getFixedAndActivityProjectList(
  client: BinanceSignedClient,
  payload: GetFixedAndActivityProjectListPayload,
) {
  const response = await apiCall<GetFixedAndActivityProjectListResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/lending/project/list',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parseArray<GetFixedAndActivityProjectListResponseRaw, GetFixedAndActivityProjectListResponse>(
    response,
    ({ interestPerLot, interestRate, lotSize, ...other }) => ({
      interestPerLot: parse(interestPerLot, numberParser),
      interestRate: parse(interestRate, numberParser),
      lotSize: parse(lotSize, numberParser),
      ...other,
    }),
  );
}
