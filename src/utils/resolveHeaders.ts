import LINQ from '@berish/linq';

export function resolveHeaders(headers: [string, string][], headersGet?: string[], mode: 'startWith' | 'strict' = 'startWith') {
  headers = headers || [];
  if (!headersGet) return headers;

  const data = LINQ.from(headersGet)
    .map((m) => m.toLocaleLowerCase())
    .selectMany((m) =>
      headers.filter(([key]) => {
        const lowerCase = key.toLocaleLowerCase();
        if (mode === 'startWith') return key.toLocaleLowerCase().startsWith(m);
        return lowerCase === m;
      }),
    )
    .toArray();

  return data;
}
