import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface ToggleBNBBurnOnSpotTradeAndMarginInterestPayload {}

export interface ToggleBNBBurnOnSpotTradeAndMarginInterestResponse {
  coin: string;
}

interface ToggleBNBBurnOnSpotTradeAndMarginInterestPayloadRaw {}

interface ToggleBNBBurnOnSpotTradeAndMarginInterestResponseRaw {
  coin: string;
}

export async function toggleBNBBurnOnSpotTradeAndMarginInterest(
  client: BinanceSignedClient,
  payload: ToggleBNBBurnOnSpotTradeAndMarginInterestPayload,
) {
  const payloadRaw = parse<
    ToggleBNBBurnOnSpotTradeAndMarginInterestPayload,
    ToggleBNBBurnOnSpotTradeAndMarginInterestPayloadRaw
  >(payload, (data) => data);

  const response = await apiCall<ToggleBNBBurnOnSpotTradeAndMarginInterestResponseRaw>({
    host: 'spot',
    path: 'toggleBNBBurnOnSpotTradeAndMarginInterest_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<ToggleBNBBurnOnSpotTradeAndMarginInterestResponseRaw, ToggleBNBBurnOnSpotTradeAndMarginInterestResponse>(
    response,
    (data) => data,
  );
}
