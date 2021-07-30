import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface ChangeInitialLeveragePayload {
  symbol: string;
  leverage: number;
}

export interface ChangeInitialLeverageResponse {
  leverage: number;
  maxNotionalValue: number;
  symbol: string;
}

interface ChangeInitialLeverageResponseRaw {
  leverage: number;
  maxNotionalValue: string;
  symbol: string;
}

export async function changeInitialLeverage(client: BinanceSignedClient, payload: ChangeInitialLeveragePayload) {
  const response = await apiCall<ChangeInitialLeverageResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/leverage',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: payload,
  });

  return parse<ChangeInitialLeverageResponseRaw, ChangeInitialLeverageResponse>(
    response,
    ({ maxNotionalValue, ...other }) => ({
      maxNotionalValue: parse(maxNotionalValue, numberParser),
      ...other,
    }),
  );
}
