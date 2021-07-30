import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import {
  parseArray,
  parse,
  boolParser,
  regExpParser,
  stringParser,
  numberParser,
  dateParser,
} from '@berish/safe-parsing';
import { spot, XOR } from '../../../info';

export type QueryAllOCOPayload = XOR<
  {
    fromId?: number;
  },
  {
    startTime?: Date | number;
    endTime?: Date | number;
  }
> & { limit?: number };
interface QueryAllOCOPayloadRaw {
  fromId?: number;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

export async function queryAllOCO(client: BinanceSignedClient, payload?: QueryAllOCOPayload) {
  const payloadRaw = parse<QueryAllOCOPayload, QueryAllOCOPayloadRaw>(payload, ({ startTime, endTime, ...other }) => ({
    startTime: parse(startTime, numberParser),
    endTime: parse(endTime, numberParser),
    ...other,
  }));

  const response = await apiCall<spot.OrderOCOQueryResponseRaw[]>({
    host: 'spot',
    path: '/api/v3/allOrderList',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<spot.OrderOCOQueryResponseRaw, spot.OrderOCOQueryResponse>(response, spot.parseQueryOrderOCO);
}
