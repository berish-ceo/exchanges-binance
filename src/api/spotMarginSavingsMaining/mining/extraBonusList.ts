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

export interface ExtraBonusListPayload {
  algo: string;
  userName: string;
  coin?: string;
  startDate?: Date | number;
  endDate?: Date | number;
  pageIndex?: number;
  pageSize?: number;
}

export interface ExtraBonusListResponse {
  otherProfits: {
    time: Date;
    coinName: string;
    type: spot.MiningProfitTypeEnum;
    profitAmount: number;
    status: spot.MiningProfitStatusEnum;
  }[];
  totalNum: number;
  pageSize: number;
}

interface ExtraBonusListPayloadRaw {
  algo: string;
  userName: string;
  coin?: string;
  startDate?: number;
  endDate?: number;
  pageIndex?: number;
  pageSize?: number;
}

interface ExtraBonusListResponseRaw {
  code: number;
  msg: string;
  data: {
    otherProfits: {
      time: number;
      coinName: string;
      type: spot.MiningProfitTypeEnum;
      profitAmount: number;
      status: spot.MiningProfitStatusEnum;
    }[];
    totalNum: number;
    pageSize: number;
  };
}

export async function extraBonusList(client: BinanceSignedClient, payload: ExtraBonusListPayload) {
  const payloadRaw = parse<ExtraBonusListPayload, ExtraBonusListPayloadRaw>(
    payload,
    ({ startDate, endDate, ...other }) => ({
      startDate: parse(startDate, numberParser),
      endDate: parse(endDate, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<ExtraBonusListResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/mining/payment/other',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<ExtraBonusListResponseRaw, ExtraBonusListResponse>(response, ({ data }) =>
    parse(data, ({ otherProfits, ...other }) => ({
      otherProfits: parseArray(otherProfits, ({ time, ...other }) => ({ time: parse(time, dateParser), ...other })),
      ...other,
    })),
  );
}
