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

export interface AccountListPayload {
  algo: string;
  userName: string;
}

export interface AccountListResponse {
  type: string;
  userName: string;
  list: {
    time: Date;
    hashrate: number;
    reject: number;
  }[];
}

interface AccountListResponseRaw {
  code: number;
  msg: string;
  data: {
    type: string;
    userName: string;
    list: {
      time: number;
      hashrate: string;
      reject: string;
    }[];
  }[];
}

export async function accountList(client: BinanceSignedClient, payload: AccountListPayload) {
  const response = await apiCall<AccountListResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/mining/statistics/user/list',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<AccountListResponseRaw, AccountListResponse[]>(response, ({ data }) =>
    parseArray(data, ({ list, ...other }) => ({
      list: parseArray(list, ({ time, hashrate, reject, ...other }) => ({
        time: parse(time, dateParser),
        hashrate: parse(hashrate, numberParser),
        reject: parse(reject, numberParser),
        ...other,
      })),
      ...other,
    })),
  );
}
