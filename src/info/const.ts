export const X_MBX_USED_WEIGHT_HEADER = 'x-mbx-used-weight';
export const SYMBOL_X_MBX_USED_WEIGHT = Symbol(X_MBX_USED_WEIGHT_HEADER);

export const SPOT_HOSTS = {
  baseHost: 'https://api.binance.com',
  clusterHost1: 'https://api1.binance.com',
  clusterHost2: 'https://api2.binance.com',
  clusterHost3: 'https://api3.binance.com',
  socketHost: 'wss://stream.binance.com:9443/ws',

  testBaseHost: 'https://testnet.binance.vision',
  testSocketHost: 'wss://testnet.binance.vision/ws',
};

export const USDTM_HOSTS = {
  baseHost: 'https://fapi.binance.com',
  socketHost: 'wss://fstream.binance.com/ws',

  testBaseHost: 'https://testnet.binancefuture.com',
  testSocketHost: 'wss://stream.binancefuture.com/ws',
};

export const COINM_HOSTS = {
  baseHost: 'https://dapi.binance.com',
  socketHost: 'wss://dstream.binance.com/ws',

  testBaseHost: 'https://testnet.binancefuture.com',
  testSocketHost: 'wss://dstream.binancefuture.com/ws',
};

export const VANILLA_HOSTS = {
  baseHost: 'https://vapi.binance.com',
  socketHost: 'wss://vstream.binance.com/ws',
};
