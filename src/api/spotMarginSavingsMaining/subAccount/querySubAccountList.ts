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

export interface QuerySubAccountListPayload {
  email?: string;
  isFreeze?: boolean;
  page?: number;
  limit?: number;
}

export interface QuerySubAccountListResponse {
  email: string;
  isFreeze: boolean;
  createTime: Date;
}

interface QuerySubAccountListResponseRaw {
  subAccounts: {
    email: string;
    isFreeze: boolean;
    createTime: number;
  }[];
}

export async function querySubAccountList(client: BinanceSignedClient, payload?: QuerySubAccountListPayload) {
  const response = await apiCall<QuerySubAccountListResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/list',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<QuerySubAccountListResponseRaw, QuerySubAccountListResponse[]>(response, ({ subAccounts }) =>
    parseArray(subAccounts, ({ createTime, ...other }) => ({ createTime: parse(createTime, dateParser), ...other })),
  );
}
