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

export interface HashrateResaleDetailPayload {
  configId: number;
  userName: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface HashrateResaleDetailResponse {
  profitTransferDetails: {
    poolUsername: string;
    toPoolUsername: string;
    algoName: string;
    hashRate: number;
    day: Date;
    amount: number;
    coinName: string;
  }[];
  totalNum: number;
  pageSize: number;
}

interface HashrateResaleDetailResponseRaw {
  code: number;
  msg: string;
  data: {
    profitTransferDetails: {
      poolUsername: string;
      toPoolUsername: string;
      algoName: string;
      hashRate: number;
      day: number;
      amount: number;
      coinName: string;
    }[];
    totalNum: number;
    pageSize: number;
  };
}

export async function hashrateResaleDetail(client: BinanceSignedClient, payload: HashrateResaleDetailPayload) {
  const response = await apiCall<HashrateResaleDetailResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/mining/hash-transfer/profit/details',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<HashrateResaleDetailResponseRaw, HashrateResaleDetailResponse>(response, ({ data }) =>
    parse(data, ({ profitTransferDetails, ...other }) => ({
      profitTransferDetails: parseArray(profitTransferDetails, ({ day, ...other }) => ({
        day: parse(day, dateParser),
        ...other,
      })),
      ...other,
    })),
  );
}
