// Utility Autentikasi Admin untuk Cloudflare Workers & SSR (Web Crypto API)

const SESSION_SECRET = 'nihongo_repo_super_secret_session_key_2026';

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hashHex = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(':');
  if (!saltHex || !hashHex) return false;

  const matches = saltHex.match(/.{1,2}/g);
  if (!matches) return false;
  const salt = new Uint8Array(matches.map((byte) => parseInt(byte, 16)));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const derivedHex = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return derivedHex === hashHex;
}

// Session Token Creation & Verification via HMAC-SHA256
export async function createSessionToken(username: string): Promise<string> {
  const timestamp = Date.now();
  const payload = `${username}:${timestamp}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const signatureHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const tokenData = JSON.stringify({ payload, signature: signatureHex });
  return btoa(tokenData);
}

export async function verifySessionToken(token: string): Promise<{ valid: boolean; username?: string }> {
  try {
    const raw = atob(token);
    const { payload, signature } = JSON.parse(raw);
    const [username, timestampStr] = payload.split(':');
    const timestamp = parseInt(timestampStr, 10);

    // Expire session after 7 days
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > SEVEN_DAYS) {
      return { valid: false };
    }

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(SESSION_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigMatches = signature.match(/.{1,2}/g);
    if (!sigMatches) return { valid: false };
    const sigBytes = new Uint8Array(sigMatches.map((byte: string) => parseInt(byte, 16)));

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      new TextEncoder().encode(payload)
    );

    return { valid: isValid, username: isValid ? username : undefined };
  } catch (err) {
    return { valid: false };
  }
}
