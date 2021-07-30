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

export interface RedeemBLVTPayload {
  tokenName: string;
  amount: number;
}

export interface RedeemBLVTResponse {
  id: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILTURE';
  tokenName: string;
  redeemAmount: number;
  amount: number;
  timestamp: Date;
}

interface RedeemBLVTResponseRaw {
  id: number;
  status: 'S' | 'P' | 'F';
  tokenName: string;
  redeemAmount: string;
  amount: string;
  timestamp: number;
}

export async function redeemBLVT(client: BinanceSignedClient, payload: RedeemBLVTPayload) {
  const response = await apiCall<RedeemBLVTResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/blvt/redeem',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<RedeemBLVTResponseRaw, RedeemBLVTResponse>(
    response,
    ({ status, redeemAmount, amount, timestamp, ...other }) => ({
      status: parse(status, (value) =>
        value === 'S' ? 'SUCCESS' : value === 'P' ? 'PENDING' : value === 'F' ? 'FAILTURE' : null,
      ),
      redeemAmount: parse(redeemAmount, numberParser),
      amount: parse(amount, numberParser),
      timestamp: parse(timestamp, dateParser),
      ...other,
    }),
  );
}
