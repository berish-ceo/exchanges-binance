import axios, { AxiosInstance } from 'axios';

import { spotMarginSavingsMaining } from '../api';
import { CONST } from '../info';
import { responseErrorInterceptor, responseUpdateXMBXUsedWeight } from '../interceptors';

export interface BinanceClientOptions {
  spotApiEndpoint?: string;
  spotSocketEndpoint?: string;

  usdFuturesApiEndpoint?: string;
  usdFuturesSocketEndpoint?: string;

  coinFuturesApiEndpoint?: string;
  coinFuturesSocketEndpoint?: string;

  vanillaApiEndpoint?: string;
  vanillaSocketEndpoint?: string;

  axios?: AxiosInstance;
}
export class BinanceClient {
  public [CONST.SYMBOL_X_MBX_USED_WEIGHT]: number = null;
  protected _options: BinanceClientOptions = null;

  constructor(options?: BinanceClientOptions) {
    if (options && typeof options !== 'object') throw new TypeError('BinanceClient options is not object');

    this._options = options || {};
    this._options.spotApiEndpoint = this._options.spotApiEndpoint || CONST.SPOT_HOSTS.baseHost;
    this._options.spotSocketEndpoint = this._options.spotSocketEndpoint || CONST.SPOT_HOSTS.socketHost;
    this._options.usdFuturesApiEndpoint = this._options.usdFuturesApiEndpoint || CONST.USDTM_HOSTS.baseHost;
    this._options.usdFuturesSocketEndpoint = this._options.usdFuturesSocketEndpoint || CONST.USDTM_HOSTS.socketHost;
    this._options.coinFuturesApiEndpoint = this._options.coinFuturesApiEndpoint || CONST.COINM_HOSTS.baseHost;
    this._options.coinFuturesSocketEndpoint = this._options.coinFuturesSocketEndpoint || CONST.COINM_HOSTS.socketHost;
    this._options.vanillaApiEndpoint = this._options.vanillaApiEndpoint || CONST.VANILLA_HOSTS.baseHost;
    this._options.vanillaSocketEndpoint = this._options.vanillaSocketEndpoint || CONST.VANILLA_HOSTS.socketHost;
    this._options.axios = this._options.axios || axios.create({ timeout: 10000 });

    responseErrorInterceptor(this)(this._options.axios);
    responseUpdateXMBXUsedWeight(this)(this._options.axios);
  }

  get options(): BinanceClientOptions {
    return this._options;
  }

  get axios() {
    return this.options.axios;
  }

  get spotApiEndpoint() {
    return this.options.spotApiEndpoint;
  }

  get spotSocketEndpoint() {
    return this.options.spotSocketEndpoint;
  }

  get usdFuturesApiEndpoint() {
    return this.options.usdFuturesApiEndpoint;
  }

  get usdFuturesSocketEndpoint() {
    return this.options.usdFuturesSocketEndpoint;
  }

  get coinFuturesApiEndpoint() {
    return this.options.coinFuturesApiEndpoint;
  }

  get coinFuturesSocketEndpoint() {
    return this.options.coinFuturesSocketEndpoint;
  }

  get vanillaApiEndpoint() {
    return this.options.vanillaApiEndpoint;
  }

  get vanillaSocketEndpoint() {
    return this.options.vanillaSocketEndpoint;
  }

  get XMBXUsedWeight() {
    return this[CONST.SYMBOL_X_MBX_USED_WEIGHT] || 0;
  }

  getTime = () => {
    return Date.now();
  };

  checkGeneralAPIConnection = async () => {
    try {
      await spotMarginSavingsMaining.marketData.checkServerTime(this);
      return true;
    } catch (err) {
      return false;
    }
  };
}
