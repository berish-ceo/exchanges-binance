import crypto from 'crypto';

export function createSignature(key: string, data: string) {
  return crypto.createHmac('sha256', key).update(data).digest('hex');
}
