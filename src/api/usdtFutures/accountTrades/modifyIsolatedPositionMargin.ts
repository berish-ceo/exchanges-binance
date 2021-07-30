import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { usdtM } from '../../../info';

export interface ModifyIsolatedPositionMarginPayload {
  symbol: string;
  amount: number;
  type?: usdtM.ModifyIsolatedPositionMarginTypeEnum;
  positionSide?: usdtM.PositionSide;
}

export interface ModifyIsolatedPositionMarginResponse {
  amount: number;
  code: number;
  msg: string;
  type: usdtM.ModifyIsolatedPositionMarginTypeEnum;
}

export async function modifyIsolatedPositionMargin(
  client: BinanceSignedClient,
  payload: ModifyIsolatedPositionMarginPayload,
) {
  const response = await apiCall<ModifyIsolatedPositionMarginResponse>({
    host: 'usdtM',
    path: '/fapi/v1/positionMargin',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: payload,
  });

  return response;
}
