import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface TransferToMasterPayload {
  asset: string;
  amount: number;
}

export type TransferToMasterResponse = string;
interface TransferToMasterResponseRaw {
  txnId: string;
}

export async function transferToMaster(client: BinanceSignedClient, payload: TransferToMasterPayload) {
  const response = await apiCall<TransferToMasterResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/transfer/subToMaster',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<TransferToMasterResponseRaw, TransferToMasterResponse>(response, ({ txnId }) => txnId);
}
