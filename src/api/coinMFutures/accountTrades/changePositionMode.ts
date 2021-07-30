import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { coinM } from '../../../info';

interface ChangePositionModeResponseRaw {
  code: number;
  msg: string;
}

export async function changePositionMode(client: BinanceSignedClient, dualSidePosition: coinM.PositionMode) {
  await apiCall<ChangePositionModeResponseRaw>({
    host: 'spot',
    path: '/dapi/v1/positionSide/dual',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: { dualSidePosition: dualSidePosition === 'HEDGE' ? true : dualSidePosition === 'ONE_WAY' ? false : null },
  });
}
