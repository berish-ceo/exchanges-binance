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

export interface GetLiquidityOperationRecordPayload {
  operationId?: number;
  poolId?: number;
  operation?: 'ADD' | 'REMOVE';
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface GetLiquidityOperationRecordResponse {
  operationId: number;
  poolId: number;
  poolName: string;
  operation: 'ADD' | 'REMOVE';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  updateTime: Date;
  shareAmount: number;
}

interface GetLiquidityOperationRecordPayloadRaw {
  operationId?: number;
  poolId?: number;
  operation?: 'ADD' | 'REMOVE';
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface GetLiquidityOperationRecordResponseRaw {
  operationId: number;
  poolId: number;
  poolName: string;
  operation: 'ADD' | 'REMOVE';
  status: 0 | 1 | 2;
  updateTime: number;
  shareAmount: string;
}

export async function getLiquidityOperationRecord(
  client: BinanceSignedClient,
  payload: GetLiquidityOperationRecordPayload,
) {
  const payloadRaw = parse<GetLiquidityOperationRecordPayload, GetLiquidityOperationRecordPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<GetLiquidityOperationRecordResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/bswap/liquidityOps',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<GetLiquidityOperationRecordResponseRaw, GetLiquidityOperationRecordResponse>(
    response,
    ({ status, updateTime, shareAmount, ...other }) => ({
      status: parse(status, (value) =>
        value === 0 ? 'PENDING' : value === 1 ? 'SUCCESS' : value === 2 ? 'FAILED' : value,
      ),
      updateTime: parse(updateTime, dateParser),
      shareAmount: parse(shareAmount, numberParser),
      ...other,
    }),
  );
}
