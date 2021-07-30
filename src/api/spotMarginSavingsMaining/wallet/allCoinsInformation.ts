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

export interface AllCoinsInformationItem {
  coin: string;
  depositAllEnable: boolean;
  free: number;
  freeze: number;
  ipoable: number;
  ipoing: number;
  isLegalMoney: boolean;
  locked: number;
  name: string;
  networkList: {
    addressRegex: RegExp;
    memoRegex: RegExp;
    coin: string;
    depositDesc: string;
    depositEnable: boolean;
    isDefault: boolean;
    minConfirm: number;
    name: string;
    network: string;
    resetAddressStatus: boolean;
    specialTips: string;
    unLockConfirm: number;
    withdrawDesc: string;
    withdrawEnable: boolean;
    withdrawFee: number;
    withdrawMin: number;
    withdrawMax: number;
    insertTime: Date;
    updateTime: Date;
    withdrawIntegerMultiple: number;
  }[];
  storage: number;
  trading: boolean;
  withdrawAllEnable: boolean;
  withdrawing: number;
}

interface AllCoinsInformationItemRaw {
  coin: string;
  depositAllEnable: boolean;
  free: string;
  freeze: string;
  ipoable: string;
  ipoing: string;
  isLegalMoney: boolean;
  locked: string;
  name: string;
  networkList: {
    addressRegex: string;
    coin: string;
    depositDesc: string;
    depositEnable: boolean;
    isDefault: boolean;
    memoRegex: string;
    minConfirm: number;
    name: string;
    network: string;
    resetAddressStatus: boolean;
    specialTips: string;
    unLockConfirm: number;
    withdrawDesc: string;
    withdrawEnable: boolean;
    withdrawFee: string;
    withdrawMin: string;
    withdrawMax: string;
    insertTime: number;
    updateTime: number;
    withdrawIntegerMultiple: string;
  }[];
  storage: string;
  trading: boolean;
  withdrawAllEnable: boolean;
  withdrawing: string;
}

export async function allCoinsInformation(client: BinanceSignedClient) {
  const response = await apiCall<AllCoinsInformationItemRaw[]>({
    host: 'spot',
    path: '/sapi/v1/capital/config/getall',
    method: 'GET',
    securityType: 'USER_DATA',
    client,
  });

  return parseArray<AllCoinsInformationItemRaw, AllCoinsInformationItem>(
    response,
    ({ free, freeze, ipoable, ipoing, locked, storage, withdrawing, networkList, ...other }) => ({
      free: parse(free, numberParser),
      freeze: parse(freeze, numberParser),
      ipoable: parse(ipoable, numberParser),
      ipoing: parse(ipoing, numberParser),
      locked: parse(locked, numberParser),
      storage: parse(storage, numberParser),
      withdrawing: parse(withdrawing, numberParser),

      networkList: parseArray(
        networkList,
        ({
          addressRegex,
          memoRegex,
          withdrawFee,
          withdrawMin,
          insertTime,
          updateTime,
          withdrawIntegerMultiple,
          withdrawMax,
          ...other
        }) => ({
          addressRegex: parse(addressRegex, regExpParser),
          memoRegex: parse(memoRegex, regExpParser),
          withdrawFee: parse(withdrawFee, numberParser),
          withdrawMin: parse(withdrawMin, numberParser),
          withdrawMax: parse(withdrawMax, numberParser),
          insertTime: parse(insertTime, dateParser),
          updateTime: parse(updateTime, dateParser),
          withdrawIntegerMultiple: parse(withdrawIntegerMultiple, numberParser),
          ...other,
        }),
      ),

      ...other,
    }),
  );
}
