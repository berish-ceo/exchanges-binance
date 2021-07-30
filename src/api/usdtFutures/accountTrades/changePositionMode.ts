import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

interface ChangePositionModeResponseRaw {
  code: number;
  msg: string;
}

export async function changePositionMode(client: BinanceSignedClient, dualSidePosition: boolean) {
  await apiCall<ChangePositionModeResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/positionSide/dual',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: { dualSidePosition },
  });
}
