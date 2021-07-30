import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { coinM } from '../../../info';

export interface ModifyIsolatedPositionMarginPayload {
  symbol: string;
  amount: number;
  type?: coinM.ModifyIsolatedPositionMarginTypeEnum;
  positionSide?: coinM.PositionSide;
}

export interface ModifyIsolatedPositionMarginResponse {
  amount: number;
  code: number;
  msg: string;
  type: coinM.ModifyIsolatedPositionMarginTypeEnum;
}

export async function modifyIsolatedPositionMargin(
  client: BinanceSignedClient,
  payload: ModifyIsolatedPositionMarginPayload,
) {
  const response = await apiCall<ModifyIsolatedPositionMarginResponse>({
    host: 'usdtM',
    path: '/dapi/v1/positionMargin',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: payload,
  });

  return response;
}
