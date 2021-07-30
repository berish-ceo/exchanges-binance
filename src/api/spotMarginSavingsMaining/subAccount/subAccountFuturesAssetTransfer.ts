import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { spot } from '../../../info';

export interface SubAccountFuturesAssetTransferPayload {
  fromEmail: string;
  toEmail: string;
  futuresType: spot.FuturesTypeEnum;
  asset: string;
  amount: number;
}

export type SubAccountFuturesAssetTransferResponse = number;

interface SubAccountFuturesAssetTransferResponseRaw {
  success: boolean;
  txnId: string;
}

export async function subAccountFuturesAssetTransfer(
  client: BinanceSignedClient,
  payload: SubAccountFuturesAssetTransferPayload,
) {
  const response = await apiCall<SubAccountFuturesAssetTransferResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/futures/internalTransfer',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<SubAccountFuturesAssetTransferResponseRaw, SubAccountFuturesAssetTransferResponse>(
    response,
    ({ txnId }) => parse(txnId, numberParser),
  );
}
