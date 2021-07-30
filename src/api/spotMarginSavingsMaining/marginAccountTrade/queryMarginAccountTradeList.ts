import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QueryMarginAccountTradeListPayload {}

export interface QueryMarginAccountTradeListResponse {
  coin: string;
}

interface QueryMarginAccountTradeListPayloadRaw {}

interface QueryMarginAccountTradeListResponseRaw {
  coin: string;
}

export async function queryMarginAccountTradeList(
  client: BinanceSignedClient,
  payload: QueryMarginAccountTradeListPayload,
) {
  const payloadRaw = parse<QueryMarginAccountTradeListPayload, QueryMarginAccountTradeListPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<QueryMarginAccountTradeListResponseRaw>({
    host: 'spot',
    path: 'queryMarginAccountTradeList_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryMarginAccountTradeListResponseRaw, QueryMarginAccountTradeListResponse>(response, (data) => data);
}
