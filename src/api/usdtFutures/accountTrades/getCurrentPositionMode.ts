import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export type GetCurrentPositionModeResponse = boolean;

interface GetCurrentPositionModeResponseRaw {
  dualSidePosition: boolean;
}

export async function getCurrentPositionMode(client: BinanceSignedClient) {
  const response = await apiCall<GetCurrentPositionModeResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/positionSide/dual',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parse<GetCurrentPositionModeResponseRaw, GetCurrentPositionModeResponse>(
    response,
    ({ dualSidePosition }) => dualSidePosition,
  );
}
