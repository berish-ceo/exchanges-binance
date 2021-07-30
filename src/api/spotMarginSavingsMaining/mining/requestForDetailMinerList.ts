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

export interface RequestForDetailMinerListPayload {
  algo: string;
  userName: string;
  workerName: string;
}

export interface RequestForDetailMinerListResponse {
  workerName: string;
  type: string;
  hashrateDatas: {
    time: Date;
    hashrate: string;
    reject: number;
  }[];
}

interface RequestForDetailMinerListResponseRaw {
  code: number;
  msg: string;
  data: {
    workerName: string;
    type: string;
    hashrateDatas: {
      time: number;
      hashrate: string;
      reject: number;
    }[];
  }[];
}

export async function requestForDetailMinerList(
  client: BinanceSignedClient,
  payload: RequestForDetailMinerListPayload,
) {
  const response = await apiCall<RequestForDetailMinerListResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/mining/worker/detail',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<RequestForDetailMinerListResponseRaw, RequestForDetailMinerListResponse[]>(response, ({ data }) =>
    parseArray(data, ({ hashrateDatas, ...other }) => ({
      hashrateDatas: parseArray(hashrateDatas, ({ time, ...other }) => ({ time: parse(time, dateParser), ...other })),
      ...other,
    })),
  );
}
