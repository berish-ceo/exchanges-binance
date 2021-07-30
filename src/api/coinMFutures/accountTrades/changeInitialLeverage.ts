import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface ChangeInitialLeveragePayload {
  symbol: string;
  leverage: number;
}

export interface ChangeInitialLeverageResponse {
  leverage: number;
  maxQuantity: number;
  symbol: string;
}

interface ChangeInitialLeverageResponseRaw {
  leverage: number;
  maxQty: string;
  symbol: string;
}

export async function changeInitialLeverage(client: BinanceSignedClient, payload: ChangeInitialLeveragePayload) {
  const response = await apiCall<ChangeInitialLeverageResponseRaw>({
    host: 'spot',
    path: '/dapi/v1/leverage',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: payload,
  });

  return parse<ChangeInitialLeverageResponseRaw, ChangeInitialLeverageResponse>(response, ({ maxQty, ...other }) => ({
    maxQuantity: parse(maxQty, numberParser),
    ...other,
  }));
}
