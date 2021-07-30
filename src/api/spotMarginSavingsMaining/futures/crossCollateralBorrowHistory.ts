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
import { spot } from '../../../info';

export interface CrossCollateralBorrowHistoryPayload {
  coin?: string;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface CrossCollateralBorrowHistoryResponse {
  rows: {
    confirmedTime: Date;
    coin: string;
    collateralRate: number;
    leftTotal: number;
    leftPrincipal: number;
    deadline: Date;
    collateralCoin: string;
    collateralAmount: number;
    orderStatus: spot.OrderStatus;
    borrowId: string;
  }[];
  total: number;
}

interface CrossCollateralBorrowHistoryPayloadRaw {
  coin?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface CrossCollateralBorrowHistoryResponseRaw {
  rows: {
    confirmedTime: number;
    coin: string;
    collateralRate: string;
    leftTotal: string;
    leftPrincipal: string;
    deadline: number;
    collateralCoin: string;
    collateralAmount: string;
    orderStatus: spot.OrderStatus;
    borrowId: string;
  }[];
  total: number;
}

export async function crossCollateralBorrowHistory(
  client: BinanceSignedClient,
  payload?: CrossCollateralBorrowHistoryPayload,
) {
  const payloadRaw = parse<CrossCollateralBorrowHistoryPayload, CrossCollateralBorrowHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<CrossCollateralBorrowHistoryResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/borrow/history',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<CrossCollateralBorrowHistoryResponseRaw, CrossCollateralBorrowHistoryResponse>(
    response,
    ({ rows, ...other }) => ({
      rows: parseArray(
        rows,
        ({ confirmedTime, collateralRate, leftTotal, leftPrincipal, deadline, collateralAmount, ...other }) => ({
          confirmedTime: parse(confirmedTime, dateParser),
          collateralRate: parse(collateralRate, numberParser),
          leftTotal: parse(leftTotal, numberParser),
          leftPrincipal: parse(leftPrincipal, numberParser),
          deadline: parse(deadline, dateParser),
          collateralAmount: parse(collateralAmount, numberParser),
          ...other,
        }),
      ),
      ...other,
    }),
  );
}
