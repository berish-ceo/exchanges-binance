import { BinanceKeyClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { UserDataResponseRaw, UserDataResponse, parseUserData } from './parsers';

export function listenIsolatedMargin(client: BinanceKeyClient, symbol: string, callback: (data: UserDataResponse, error?: any) => any) {
  if (!symbol) throw new TypeError('listenIsolatedMargin symbol is empty');
  if (typeof symbol !== 'string') throw new TypeError('listenIsolatedMargin symbol is not string');

  const parseCallback =
    callback &&
    ((data: UserDataResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parseUserData(data);
      callback(response);
    });

  return apiCall<UserDataResponseRaw>(
    {
      host: 'spot',
      path: '/sapi/v1/userDataStream/isolated',
      securityType: 'USER_DATA_STREAM',

      client,
      data: { symbol },
    },
    parseCallback,
  );
}
