/**
 * Build query string for uri encoded url based on json object
 */
export const makeQueryString = (obj: { [key: string]: any }) => {
  if (!obj) throw new TypeError('makeQueryString obj is empty');
  if (typeof obj !== 'object') throw new TypeError('makeQueryString obj is not object');

  const entries = Object.entries(obj);
  if (entries.length <= 0) return '';

  return convertObject(obj);
};

function convertPrimitive(input: any) {
  return encodeURIComponent(input);
}

function convertObject(input: { [key: string]: any }) {
  return Object.entries(input)
    .map(([key, value]) => {
      if (typeof value === 'undefined' || value === null) return null;
      if (typeof value === 'object' && !Array.isArray(value)) {
        return `${convertPrimitive(key)}=${convertPrimitive(JSON.stringify(value))}`;
      }
      if (Array.isArray(value)) {
        // const data = value.map((item) => convertPrimitive(JSON.stringify(item))).join(',');
        // return `${convertPrimitive(key)}=[${data}]`;

        return `${convertPrimitive(key)}=[${value.map((item) => convertPrimitive(JSON.stringify(item))).join(',')}]`;
      }
      return `${convertPrimitive(key)}=${convertPrimitive(value)}`;
    })
    .filter(Boolean)
    .join('&');
}
