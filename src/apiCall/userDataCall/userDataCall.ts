import { BinanceKeyClient } from '../../clients';
import { apiCall, ApiCallHostType } from '../apiCall';

import { createListenKey } from './createListenKey';
import { pingListenKey } from './pingListenKey';
import { closeListenKey } from './closeListenKey';

export interface UserDataCallOptions {
  client: BinanceKeyClient;
  host: ApiCallHostType;
  path: string;

  data?: { [name: string]: any };
}

export function userDataCall(options: UserDataCallOptions, callback: (data: any, error?: any) => any) {
  if (!options) throw new TypeError('userDataCall options is empty');
  if (typeof options !== 'object') throw new TypeError('userDataCall options is not object');

  if (!callback) throw new TypeError('userDataCall callback is empty');
  if (typeof callback !== 'function') throw new TypeError('userDataCall callback is not function');

  if (!options.client) throw new TypeError('userDataCall options.client is empty');
  if (!options.host) throw new TypeError('userDataCall options.host is empty');
  if (!options.path) throw new TypeError('userDataCall options.path is empty');

  let currentListenKey: string = null;
  let currentUnlistener: () => void = null;
  let currentInterval: NodeJS.Timeout = null;
  let currentRecreateTimeout: NodeJS.Timeout = null;

  const close = async () => {
    // Закрытие внутренних событий
    try {
      if (currentRecreateTimeout) {
        clearTimeout(currentRecreateTimeout);
        currentRecreateTimeout = null;
      }
      if (currentInterval) {
        clearInterval(currentInterval);
        currentInterval = null;
      }

      if (currentListenKey) {
        await closeListenKey({ client: options.client, host: options.host, path: options.path, listenKey: currentListenKey, data: options.data });
        currentListenKey = null;
      }

      if (currentUnlistener) {
        currentUnlistener();
        currentUnlistener = null;
      }
    } catch (err) {
      currentRecreateTimeout = null;
      currentInterval = null;
      currentListenKey = null;
      currentUnlistener = null;
    }
  };

  const ping = async () => {
    if (!currentListenKey) return void 0;

    try {
      await pingListenKey({ client: options.client, host: options.host, path: options.path, listenKey: currentListenKey, data: options.data });
    } catch (err) {
      // Ключа больше не существует, если снаружи не было вызвано отключение,
      // то мы должны переподключиться
      if (currentListenKey) await recreate();
    }
  };

  const create = async (throwError: boolean) => {
    try {
      currentListenKey = await createListenKey({ client: options.client, host: options.host, path: options.path, data: options.data });
      currentUnlistener = apiCall({ client: options.client, host: options.host, path: currentListenKey, securityType: 'SOCKET' }, callback);
      currentInterval = setInterval(() => ping(), options.client.userDataStreamPingInterval);
    } catch (err) {
      if (throwError) throw err;

      await recreate();
    }
  };

  const recreate = async () => {
    currentRecreateTimeout = setTimeout(async () => {
      await close();
      createPromise = create(false);
    }, options.client.userDataStreamRecreateTimeout);
  };

  let createPromise = create(true);

  return () => {
    createPromise.then(() => close());
  };
}
