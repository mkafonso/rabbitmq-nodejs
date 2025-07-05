import { createCipheriv, randomBytes } from 'crypto';

export function encrypt(text: string): string {
  const INITIALIZATION_VECTOR_LENGTH = 16;
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

  const iv = randomBytes(Number(INITIALIZATION_VECTOR_LENGTH));

  const cipher = createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}
