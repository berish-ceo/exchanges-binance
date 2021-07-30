import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface TransferToSubAccountOfSameMasterPayload {
  fromEmail: string;
  toEmail: string;
  asset: string;
  amount: number;
}

export type TransferToSubAccountOfSameMasterResponse = string;

interface TransferToSubAccountOfSameMasterResponseRaw {
  txnId: string;
}

/**
 *
 * @deprecated Не работает на стороне Binance (работает, только от лица SubAccount)
 * @param client
 * @param payload
 * @returns
 */
export async function transferToSubAccountOfSameMaster(
  client: BinanceSignedClient,
  payload: TransferToSubAccountOfSameMasterPayload,
) {
  const response = await apiCall<TransferToSubAccountOfSameMasterResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/transfer/subToSub',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<TransferToSubAccountOfSameMasterResponseRaw, TransferToSubAccountOfSameMasterResponse>(
    response,
    ({ txnId }) => txnId,
  );
}
