import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface CancelHashrateResaleConfigurationPayload {
  configId: number;
  userName: string;
}

export type CancelHashrateResaleConfigurationResponse = boolean;

interface CancelHashrateResaleConfigurationResponseRaw {
  code: number;
  msg: string;
  data: boolean;
}

export async function cancelHashrateResaleConfiguration(
  client: BinanceSignedClient,
  payload: CancelHashrateResaleConfigurationPayload,
) {
  const response = await apiCall<CancelHashrateResaleConfigurationResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/mining/hash-transfer/config/cancel',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<CancelHashrateResaleConfigurationResponseRaw, CancelHashrateResaleConfigurationResponse>(
    response,
    ({ data }) => parse(data, boolParser),
  );
}
