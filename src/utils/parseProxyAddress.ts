export function parseProxyAddress(value: string) {
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
