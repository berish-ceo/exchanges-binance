import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QueryMarginInterestRateHistoryPayload {}

export interface QueryMarginInterestRateHistoryResponse {
  coin: string;
}

interface QueryMarginInterestRateHistoryPayloadRaw {}

interface QueryMarginInterestRateHistoryResponseRaw {
  coin: string;
}

export async function queryMarginInterestRateHistory(
  client: BinanceSignedClient,
  payload: QueryMarginInterestRateHistoryPayload,
) {
  const payloadRaw = parse<QueryMarginInterestRateHistoryPayload, QueryMarginInterestRateHistoryPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<QueryMarginInterestRateHistoryResponseRaw>({
    host: 'spot',
    path: 'queryMarginInterestRateHistory_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryMarginInterestRateHistoryResponseRaw, QueryMarginInterestRateHistoryResponse>(
    response,
    (data) => data,
  );
}
