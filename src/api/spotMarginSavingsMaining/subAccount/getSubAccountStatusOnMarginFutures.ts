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

export interface GetSubAccountStatusOnMarginFuturesResponse {
  email: string;
  isSubUserEnabled: boolean;
  isUserActive: boolean;
  insertTime: Date;
  isMarginEnabled: boolean;
  isFutureEnabled: boolean;
  mobile: string;
}

interface GetSubAccountStatusOnMarginFuturesResponseRaw {
  email: string;
  isSubUserEnabled: boolean;
  isUserActive: boolean;
  insertTime: number;
  isMarginEnabled: boolean;
  isFutureEnabled: boolean;
  mobile: string;
}

export async function getSubAccountStatusOnMarginFutures(client: BinanceSignedClient, email?: string) {
  const response = await apiCall<GetSubAccountStatusOnMarginFuturesResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/sub-account/status',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { email },
  });

  return parseArray<GetSubAccountStatusOnMarginFuturesResponseRaw, GetSubAccountStatusOnMarginFuturesResponse>(
    response,
    ({ insertTime, ...other }) => ({
      insertTime: parse(insertTime, dateParser),
      ...other,
    }),
  );
}
