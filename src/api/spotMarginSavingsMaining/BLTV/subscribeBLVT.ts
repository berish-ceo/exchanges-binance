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

export interface SubscribeBLVTPayload {
  tokenName: string;
  cost: number;
}

export interface SubscribeBLVTResponse {
  id: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILTURE';
  tokenName: string;
  amount: number;
  cost: number;
  timestamp: Date;
}

interface SubscribeBLVTResponseRaw {
  id: number;
  status: 'S' | 'P' | 'F';
  tokenName: string;
  amount: string;
  cost: string;
  timestamp: number;
}

export async function subscribeBLVT(client: BinanceSignedClient, payload: SubscribeBLVTPayload) {
  const response = await apiCall<SubscribeBLVTResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/blvt/subscribe',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<SubscribeBLVTResponseRaw, SubscribeBLVTResponse>(
    response,
    ({ status, amount, cost, timestamp, ...other }) => ({
      status: parse(status, (value) =>
        value === 'S' ? 'SUCCESS' : value === 'P' ? 'PENDING' : value === 'F' ? 'FAILTURE' : null,
      ),
      amount: parse(amount, numberParser),
      cost: parse(cost, numberParser),
      timestamp: parse(timestamp, dateParser),
      ...other,
    }),
  );
}
