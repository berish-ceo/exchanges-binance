import { BinanceClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { numberParser, parse } from '@berish/safe-parsing';
import { spot } from '../../../info';

export type SystemStatusResponse = spot.SystemStatusTypeEnum;

interface SystemStatusResponseRaw {
  status: spot.SystemStatusTypeEnum;
  msg: string;
}

export async function systemStatus(client: BinanceClient) {
  const response = await apiCall<SystemStatusResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/system/status',
    method: 'GET',
    securityType: 'NONE',
    client,
  });

  return parse<SystemStatusResponseRaw, SystemStatusResponse>(response, ({ status }) => status);
}
