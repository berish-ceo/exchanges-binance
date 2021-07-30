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

export interface EarningsListPayload {
  algo: string;
  userName: string;
  coin?: string;
  startDate?: Date | number;
  endDate?: Date | number;
  pageIndex?: number;
  pageSize?: number;
}

export interface EarningsListResponse {
  accountProfits: {
    time: Date;
    type: spot.MiningProfitTypeEnum;
    hashTransfer: number;
    transferAmount: number;
    dayHashRate: number;
    profitAmount: number;
    coinName: string;
    status: spot.MiningProfitStatusEnum;
  }[];
  totalNum: number;
  pageSize: number;
}

interface EarningsListPayloadRaw {
  algo: string;
  userName: string;
  coin?: string;
  startDate?: number;
  endDate?: number;
  pageIndex?: number;
  pageSize?: number;
}

interface EarningsListResponseRaw {
  code: number;
  msg: string;
  data: {
    accountProfits: {
      time: number;
      type: spot.MiningProfitTypeEnum;
      hashTransfer: number;
      transferAmount: number;
      dayHashRate: number;
      profitAmount: number;
      coinName: string;
      status: spot.MiningProfitStatusEnum;
    }[];
    totalNum: number;
    pageSize: number;
  };
}

export async function earningsList(client: BinanceSignedClient, payload: EarningsListPayload) {
  const payloadRaw = parse<EarningsListPayload, EarningsListPayloadRaw>(
    payload,
    ({ startDate, endDate, ...other }) => ({
      startDate: parse(startDate, numberParser),
      endDate: parse(endDate, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<EarningsListResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/mining/payment/list',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<EarningsListResponseRaw, EarningsListResponse>(response, ({ data }) =>
    parse(data, ({ accountProfits, ...other }) => ({
      accountProfits: parseArray(accountProfits, ({ time, ...other }) => ({ time: parse(time, dateParser), ...other })),
      ...other,
    })),
  );
}
