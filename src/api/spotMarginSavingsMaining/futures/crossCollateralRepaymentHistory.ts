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

export interface CrossCollateralRepaymentHistoryPayload {
  coin?: string;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface CrossCollateralRepaymentHistoryResponse {
  rows: {
    coin: string;
    amount: number;
    collateralCoin: string;
    repayType: spot.FuturesRepayType;
    releasedCollateral: number;
    price: number;
    repayCollateral: number;
    confirmedTime: Date;
    updateTime: Date;
    status: spot.FuturesTransferStatusType;
    repayId: string;
  }[];
  total: number;
}

interface CrossCollateralRepaymentHistoryPayloadRaw {
  coin?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface CrossCollateralRepaymentHistoryResponseRaw {
  rows: {
    coin: string;
    amount: string;
    collateralCoin: string;
    repayType: spot.FuturesRepayType;
    releasedCollateral: string;
    price: string;
    repayCollateral: string;
    confirmedTime: number;
    updateTime: number;
    status: spot.FuturesTransferStatusType;
    repayId: string;
  }[];
  total: number;
}

export async function crossCollateralRepaymentHistory(
  client: BinanceSignedClient,
  payload?: CrossCollateralRepaymentHistoryPayload,
) {
  const payloadRaw = parse<CrossCollateralRepaymentHistoryPayload, CrossCollateralRepaymentHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<CrossCollateralRepaymentHistoryResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/repay/history',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<CrossCollateralRepaymentHistoryResponseRaw, CrossCollateralRepaymentHistoryResponse>(
    response,
    ({ rows, ...other }) => ({
      rows: parseArray(
        rows,
        ({ amount, releasedCollateral, price, repayCollateral, confirmedTime, updateTime, ...other }) => ({
          amount: parse(amount, numberParser),
          releasedCollateral: parse(releasedCollateral, numberParser),
          price: parse(price, numberParser),
          repayCollateral: parse(repayCollateral, numberParser),
          confirmedTime: parse(confirmedTime, dateParser),
          updateTime: parse(updateTime, dateParser),
          ...other,
        }),
      ),
      ...other,
    }),
  );
}
