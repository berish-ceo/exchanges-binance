import type { AxiosRequestConfig } from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';

export interface Proxy {
  host: string;
  port: number;
  login?: string;
  password?: string;
}

export function requestProxyInterceptor(
  getProxies: (Proxy | string)[] | (() => (Proxy | string)[] | Promise<(Proxy | string)[]>),
  proxyMaxRequestAttempt?: number,
): (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig> {
  getProxies = getProxies || [];
  proxyMaxRequestAttempt = proxyMaxRequestAttempt || 5;

  let lastProxyUsed = 0;
  return async (config) => {
    const proxies = typeof getProxies === 'function' ? await getProxies() : getProxies;
    if (lastProxyUsed >= proxies.length) lastProxyUsed = 0;

    const proxy = proxies[lastProxyUsed];
    if (!proxy) return config;

    const { host, port, login, password } = typeof proxy === 'string' ? parseProxyAddress(proxy) : proxy;
    lastProxyUsed++;

    config.httpsAgent = new SocksProxyAgent({
      host,
      port,
      auth: login && [login, password].filter(Boolean).join(':'),
    });

    return config;
  };
}

function parseProxyAddress(value: string) {
  if (!value) return null;
  if (typeof value !== 'string') return null;

  const firstSplit = value.split('@');
  const authPath = firstSplit.length <= 1 ? null : firstSplit[0];
  const addressPath = firstSplit.length <= 1 ? firstSplit[0] : firstSplit[1];

  const authSplit = authPath && authPath.split(':');
  const login = authSplit ? authSplit[0] : null;
  const password = authSplit ? (authSplit.length <= 1 ? null : authSplit[1]) : null;

  const adressSplit = addressPath && addressPath.split(':');
  const host = adressSplit ? adressSplit[0] : null;
  const port = adressSplit ? (adressSplit.length <= 1 ? null : adressSplit[1]) : null;

  return { login, password, host, port };
}
