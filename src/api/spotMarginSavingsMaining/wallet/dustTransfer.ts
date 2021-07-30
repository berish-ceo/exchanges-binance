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

export interface DustTransferResponse {
  totalServiceCharge: number;
  totalTransfered: number;
  transferResult: {
    amount: number;
    fromAsset: string;
    operateTime: Date;
    serviceChargeAmount: number;
    tranId: number;
    transferedAmount: number;
  }[];
}

interface DustTransferResponseRaw {
  totalServiceCharge: string;
  totalTransfered: string;
  transferResult: {
    amount: string;
    fromAsset: string;
    operateTime: number;
    serviceChargeAmount: string;
    tranId: number;
    transferedAmount: string;
  }[];
}

export async function dustTransfer(client: BinanceSignedClient, assets: string[]) {
  const asset = (assets || []).filter(Boolean);

  const response = await apiCall<DustTransferResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/asset/dust',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: { asset },
  });

  return parse<DustTransferResponseRaw, DustTransferResponse>(
    response,
    ({ totalServiceCharge, totalTransfered, transferResult, ...other }) => ({
      totalServiceCharge: parse(totalServiceCharge, numberParser),
      totalTransfered: parse(totalTransfered, numberParser),
      transferResult: parseArray(
        transferResult,
        ({ amount, operateTime, serviceChargeAmount, transferedAmount, ...other }) => ({
          amount: parse(amount, numberParser),
          operateTime: parse(operateTime, dateParser),
          serviceChargeAmount: parse(serviceChargeAmount, numberParser),
          transferedAmount: parse(transferedAmount, numberParser),
          ...other,
        }),
      ),
      ...other,
    }),
  );
}
