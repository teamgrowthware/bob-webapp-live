import { SignJWT, jwtVerify } from 'jose';
import { cookies, headers } from 'next/headers';

const secretKey = process.env.SESSION_SECRET || 'super-secret-key-bob-[2026]';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, role, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
  return session;
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    let session = cookieStore.get('session')?.value;

    if (!session) {
      const authHeader = (await headers()).get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        session = authHeader.split(' ')[1];
      }
    }

    if (!session) return null;
    return await decrypt(session);
  } catch (e) {
    return null;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
