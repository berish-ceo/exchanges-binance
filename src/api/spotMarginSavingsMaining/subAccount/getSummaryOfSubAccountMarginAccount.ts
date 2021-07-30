import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetSummaryOfSubAccountMarginAccountResponse {
  totalAssetOfBtc: number;
  totalLiabilityOfBtc: number;
  totalNetAssetOfBtc: number;
  subAccountList: {
    email: string;
    totalAssetOfBtc: number;
    totalLiabilityOfBtc: number;
    totalNetAssetOfBtc: number;
  }[];
}

interface GetSummaryOfSubAccountMarginAccountResponseRaw {
  totalAssetOfBtc: string;
  totalLiabilityOfBtc: string;
  totalNetAssetOfBtc: string;
  subAccountList: {
    email: string;
    totalAssetOfBtc: string;
    totalLiabilityOfBtc: string;
    totalNetAssetOfBtc: string;
  }[];
}

export async function getSummaryOfSubAccountMarginAccount(client: BinanceSignedClient) {
  const response = await apiCall<GetSummaryOfSubAccountMarginAccountResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/margin/accountSummary',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parse<GetSummaryOfSubAccountMarginAccountResponseRaw, GetSummaryOfSubAccountMarginAccountResponse>(
    response,
    ({ totalAssetOfBtc, totalLiabilityOfBtc, totalNetAssetOfBtc, subAccountList, ...other }) => ({
      totalAssetOfBtc: parse(totalAssetOfBtc, numberParser),
      totalLiabilityOfBtc: parse(totalLiabilityOfBtc, numberParser),
      totalNetAssetOfBtc: parse(totalNetAssetOfBtc, numberParser),
      subAccountList: parseArray(
        subAccountList,
        ({ totalAssetOfBtc, totalLiabilityOfBtc, totalNetAssetOfBtc, ...other }) => ({
          totalAssetOfBtc: parse(totalAssetOfBtc, numberParser),
          totalLiabilityOfBtc: parse(totalLiabilityOfBtc, numberParser),
          totalNetAssetOfBtc: parse(totalNetAssetOfBtc, numberParser),
          ...other,
        }),
      ),
      ...other,
    }),
  );
}
