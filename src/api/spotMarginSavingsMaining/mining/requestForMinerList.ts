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

export interface RequestForMinerListPayload {
  algo: string;
  userName: string;
  pageIndex?: number;
  sort?: spot.MiningSortEnum;
  sortColumn?: spot.MiningSortColumnEnum;
  workerStatus?: spot.MiningWokerStatusEnum;
}

export interface RequestForMinerListResponse {
  workerDatas: {
    workerId: string;
    workerName: string;
    status: spot.MiningWokerStatusEnum;
    hashRate: number;
    dayHashRate: number;
    rejectRate: number;
    lastShareTime: Date;
  }[];
  totalNum: number;
  pageSize: number;
}

interface RequestForMinerListResponseRaw {
  code: number;
  msg: string;
  data: {
    workerDatas: {
      workerId: string;
      workerName: string;
      status: spot.MiningWokerStatusEnum;
      hashRate: number;
      dayHashRate: number;
      rejectRate: number;
      lastShareTime: number;
    }[];
    totalNum: number;
    pageSize: number;
  };
}

export async function requestForMinerList(client: BinanceSignedClient, payload: RequestForMinerListPayload) {
  const response = await apiCall<RequestForMinerListResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/mining/worker/list',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<RequestForMinerListResponseRaw, RequestForMinerListResponse>(response, ({ data }) =>
    parse(data, ({ workerDatas, ...other }) => ({
      workerDatas: parseArray(workerDatas, ({ lastShareTime, ...other }) => ({
        lastShareTime: parse(lastShareTime, dateParser),
        ...other,
      })),
      ...other,
    })),
  );
}
