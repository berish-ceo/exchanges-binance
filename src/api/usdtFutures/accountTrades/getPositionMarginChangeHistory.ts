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
import { usdtM } from '../../../info';

export interface GetPositionMarginChangeHistoryPayload {
  symbol: string;
  type?: usdtM.ModifyIsolatedPositionMarginTypeEnum;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface GetPositionMarginChangeHistoryResponse {
  amount: number;
  asset: string;
  symbol: string;
  time: Date;
  type: usdtM.ModifyIsolatedPositionMarginTypeEnum;
  positionSide: usdtM.PositionSide;
}

interface GetPositionMarginChangeHistoryPayloadRaw {
  symbol: string;
  type?: usdtM.ModifyIsolatedPositionMarginTypeEnum;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface GetPositionMarginChangeHistoryResponseRaw {
  amount: string;
  asset: string;
  symbol: string;
  time: number;
  type: usdtM.ModifyIsolatedPositionMarginTypeEnum;
  positionSide: usdtM.PositionSide;
}

export async function getPositionMarginChangeHistory(
  client: BinanceSignedClient,
  payload: GetPositionMarginChangeHistoryPayload,
) {
  const payloadRaw = parse<GetPositionMarginChangeHistoryPayload, GetPositionMarginChangeHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<GetPositionMarginChangeHistoryResponseRaw[]>({
    host: 'usdtM',
    path: '/fapi/v1/positionMargin/history',
    method: 'GET',
    securityType: 'TRADE',

    client,
    data: payloadRaw,
  });

  return parseArray<GetPositionMarginChangeHistoryResponseRaw, GetPositionMarginChangeHistoryResponse>(
    response,
    ({ amount, time, ...other }) => ({
      amount: parse(amount, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
