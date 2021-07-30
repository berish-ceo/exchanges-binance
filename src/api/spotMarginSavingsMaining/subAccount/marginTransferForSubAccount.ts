import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { spot } from '../../../info';

export interface MarginTransferForSubAccountPayload {
  email: string;
  asset: string;
  amount: number;
  type: spot.MarginTransferTypeEnum;
}

export type MarginTransferForSubAccountResponse = string;

interface MarginTransferForSubAccountResponseRaw {
  tranId: string;
}

export async function marginTransferForSubAccount(
  client: BinanceSignedClient,
  payload: MarginTransferForSubAccountPayload,
) {
  const response = await apiCall<MarginTransferForSubAccountResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/margin/transfer',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<MarginTransferForSubAccountResponseRaw, MarginTransferForSubAccountResponse>(
    response,
    ({ tranId }) => tranId,
  );
}
