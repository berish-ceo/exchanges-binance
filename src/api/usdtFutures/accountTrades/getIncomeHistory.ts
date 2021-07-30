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

export interface GetIncomeHistoryPayload {
  symbol?: string;
  incomeType?: usdtM.IncomeType;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface GetIncomeHistoryResponse {
  symbol: string;
  incomeType: usdtM.IncomeType;
  income: number;
  asset: string;
  info: string;
  time: Date;
  tranId: string;
  tradeId: string;
}

interface GetIncomeHistoryPayloadRaw {
  symbol?: string;
  incomeType?: usdtM.IncomeType;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface GetIncomeHistoryResponseRaw {
  symbol: string;
  incomeType: usdtM.IncomeType;
  income: string;
  asset: string;
  info: string;
  time: 1570608000000;
  tranId: string;
  tradeId: string;
}

export async function getIncomeHistory(client: BinanceSignedClient, payload?: GetIncomeHistoryPayload) {
  const payloadRaw = parse<GetIncomeHistoryPayload, GetIncomeHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<GetIncomeHistoryResponseRaw[]>({
    host: 'usdtM',
    path: '/fapi/v1/income',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<GetIncomeHistoryResponseRaw, GetIncomeHistoryResponse>(response, ({ income, time, ...other }) => ({
    income: parse(income, numberParser),
    time: parse(time, dateParser),
    ...other,
  }));
}
