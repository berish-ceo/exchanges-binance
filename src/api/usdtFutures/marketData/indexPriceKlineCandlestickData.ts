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

export interface IndexPriceKlineCandlestickDataPayload {
  pair: string;
  interval: usdtM.KlineCandlestickChartIntervals;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface IndexPriceKlineCandlestickDataResponse {
  openTime: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  closeTime: Date;
  numberOfBisicData: number;
}

interface IndexPriceKlineCandlestickDataPayloadRaw {
  pair: string;
  interval: usdtM.KlineCandlestickChartIntervals;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

type IndexPriceKlineCandlestickDataResponseRaw = [
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

export async function indexPriceKlineCandlestickData(
  client: BinanceClient,
  payload: IndexPriceKlineCandlestickDataPayload,
) {
  const payloadRaw = parse<IndexPriceKlineCandlestickDataPayload, IndexPriceKlineCandlestickDataPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<IndexPriceKlineCandlestickDataResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/indexPriceKlines',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payloadRaw,
  });

  return parse<IndexPriceKlineCandlestickDataResponseRaw, IndexPriceKlineCandlestickDataResponse>(
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
