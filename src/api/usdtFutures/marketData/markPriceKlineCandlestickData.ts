import { BinanceClient, BinanceSignedClient } from '../../../clients';
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

export interface MarkPriceKlineCandlestickDataPayload {
  symbol: string;
  interval: usdtM.KlineCandlestickChartIntervals;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface MarkPriceKlineCandlestickDataResponse {
  openTime: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  closeTime: Date;
  numberOfBisicData: number;
}

interface MarkPriceKlineCandlestickDataPayloadRaw {
  symbol: string;
  interval: usdtM.KlineCandlestickChartIntervals;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

type MarkPriceKlineCandlestickDataResponseRaw = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string,
];

export async function markPriceKlineCandlestickData(
  client: BinanceClient,
  payload: MarkPriceKlineCandlestickDataPayload,
) {
  const payloadRaw = parse<MarkPriceKlineCandlestickDataPayload, MarkPriceKlineCandlestickDataPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<MarkPriceKlineCandlestickDataResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/markPriceKlines',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payloadRaw,
  });

  return parse<MarkPriceKlineCandlestickDataResponseRaw, MarkPriceKlineCandlestickDataResponse>(
    response,
    ([
      openTime,
      open,
      high,
      low,
      close,
      ignore_1,
      closeTime,
      ignore_2,
      numberOfBisicData,
      ignore_3,
      ignore_4,
      ignore_5,
    ]) => ({
      openTime: parse(openTime, dateParser),
      open: parse(open, numberParser),
      high: parse(high, numberParser),
      low: parse(low, numberParser),
      close: parse(close, numberParser),
      closeTime: parse(closeTime, dateParser),
      numberOfBisicData: parse(numberOfBisicData, numberParser),
    }),
  );
}
