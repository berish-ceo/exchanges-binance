import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { spot } from '../../../info';

export interface FuturesTransferForSubAccountPayload {
  email: string;
  asset: string;
  amount: number;
  type: spot.FuturesTransferTypeEnum;
}

export type FuturesTransferForSubAccountResponse = string;

interface FuturesTransferForSubAccountResponseRaw {
  tranId: string;
}

export async function futuresTransferForSubAccount(
  client: BinanceSignedClient,
  payload: FuturesTransferForSubAccountPayload,
) {
  const response = await apiCall<FuturesTransferForSubAccountResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/futures/transfer',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<FuturesTransferForSubAccountResponseRaw, FuturesTransferForSubAccountResponse>(
    response,
    ({ tranId }) => tranId,
  );
}
