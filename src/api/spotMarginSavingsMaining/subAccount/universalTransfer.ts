import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { spot } from '../../../info';

export interface UniversalTransferPayload {
  fromEmail?: string;
  toEmail?: string;
  fromAccountType: spot.TransferAccountType;
  toAccountType: spot.TransferAccountType;
  asset: string;
  amount: number;
}

export type UniversalTransferResponse = number;

interface UniversalTransferResponseRaw {
  tranId: number;
}

export async function universalTransfer(client: BinanceSignedClient, payload: UniversalTransferPayload) {
  const response = await apiCall<UniversalTransferResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/universalTransfer',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<UniversalTransferResponseRaw, UniversalTransferResponse>(response, ({ tranId }) => tranId);
}
