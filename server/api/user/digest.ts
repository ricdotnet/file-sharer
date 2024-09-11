import crypto from 'crypto';

export default defineEventHandler((event) => {
  const randomBytes = crypto.randomBytes(16);

  return { digest: randomBytes.toString('hex') };
});