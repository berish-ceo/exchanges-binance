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

export interface DustLogPayload {
  startTime?: Date | number;
  endTime?: Date | number;
}

export interface DustLogResponse {
  total: number;
  userAssetDribblets: {
    operateTime: Date;
    totalTransferedAmount: number;
    totalServiceChargeAmount: number;
    transId: number;
    userAssetDribbletDetails: {
      transId: number;
      serviceChargeAmount: number;
      amount: number;
      operateTime: Date;
      transferedAmount: number;
      fromAsset: string;
    }[];
  }[];
}

interface DustLogPayloadRaw {
  startTime?: number;
  endTime?: number;
}

interface DustLogResponseRaw {
  total: number;
  userAssetDribblets: {
    operateTime: number;
    totalTransferedAmount: string;
    totalServiceChargeAmount: string;
    transId: number;
    userAssetDribbletDetails: {
      transId: number;
      serviceChargeAmount: string;
      amount: string;
      operateTime: number;
      transferedAmount: string;
      fromAsset: string;
    }[];
  }[];
}

export async function dustLog(client: BinanceSignedClient, payload?: DustLogPayload) {
  const payloadRaw = parse<DustLogPayload, DustLogPayloadRaw>(payload, ({ startTime, endTime }) => ({
    startTime: parse(startTime, numberParser),
    endTime: parse(endTime, numberParser),
  }));

  const response = await apiCall<DustLogResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/asset/dribblet',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<DustLogResponseRaw, DustLogResponse>(response, ({ userAssetDribblets, ...other }) => ({
    userAssetDribblets: parseArray(
      userAssetDribblets,
      ({ operateTime, totalServiceChargeAmount, totalTransferedAmount, userAssetDribbletDetails, ...other }) => ({
        operateTime: parse(operateTime, dateParser),
        totalServiceChargeAmount: parse(totalServiceChargeAmount, numberParser),
        totalTransferedAmount: parse(totalTransferedAmount, numberParser),
        userAssetDribbletDetails: parseArray(
          userAssetDribbletDetails,
          ({ serviceChargeAmount, amount, operateTime, transferedAmount, ...other }) => ({
            serviceChargeAmount: parse(serviceChargeAmount, numberParser),
            amount: parse(amount, numberParser),
            operateTime: parse(operateTime, dateParser),
            transferedAmount: parse(transferedAmount, numberParser),
            ...other,
          }),
        ),
        ...other,
      }),
    ),
    ...other,
  }));
}
