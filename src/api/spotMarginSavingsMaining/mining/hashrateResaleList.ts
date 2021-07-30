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

export interface HashrateResaleListPayload {
  pageIndex?: number;
  pageSize?: number;
}

export interface HashrateResaleListResponse {
  configDetails: {
    configId: number;
    poolUsername: string;
    toPoolUsername: string;
    algoName: string;
    hashRate: number;
    startDay: Date;
    endDay: Date;
    status: spot.MiningConfigStatusEnum;
  }[];
  totalNum: number;
  pageSize: number;
}

interface HashrateResaleListResponseRaw {
  code: number;
  msg: string;
  data: {
    configDetails: {
      configId: number;
      poolUsername: string;
      toPoolUsername: string;
      algoName: string;
      hashRate: number;
      startDay: number;
      endDay: number;
      status: spot.MiningConfigStatusEnum;
    }[];
    totalNum: number;
    pageSize: number;
  };
}

export async function hashrateResaleList(client: BinanceSignedClient, payload?: HashrateResaleListPayload) {
  const response = await apiCall<HashrateResaleListResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/mining/hash-transfer/config/details/list',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<HashrateResaleListResponseRaw, HashrateResaleListResponse>(response, ({ data }) =>
    parse(data, ({ configDetails, ...other }) => ({
      configDetails: parseArray(configDetails, ({ startDay, endDay, ...other }) => ({
        startDay: parse(startDay, dateParser),
        endDay: parse(endDay, dateParser),
        ...other,
      })),
      ...other,
    })),
  );
}
