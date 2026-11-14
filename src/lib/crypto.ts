// Web Crypto API helpers for Zero-Knowledge Vault Encryption

function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function generateSalt(): string {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return bufferToBase64(salt.buffer);
}

export async function deriveKey(masterPassword: string, saltBase64: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(masterPassword),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const saltBuffer = base64ToBuffer(saltBase64);

  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptText(
  plaintext: string,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  if (!plaintext) return { ciphertext: "", iv: "" };
  const enc = new TextEncoder();
  const encoded = enc.encode(plaintext);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encoded
  );

  return {
    ciphertext: bufferToBase64(encrypted),
    iv: bufferToBase64(iv.buffer),
  };
}

export async function decryptText(
  ciphertext: string,
  iv: string,
  key: CryptoKey
): Promise<string> {
  if (!ciphertext || !iv) return "";
  try {
    const cipherBuffer = base64ToBuffer(ciphertext);
    const ivBuffer = base64ToBuffer(iv);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(ivBuffer),
      },
      key,
      cipherBuffer
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (err) {
    console.error("Decryption failed:", err);
    return "[Decryption Error]";
  }
}

const CANARY_STRING = "VAULTX_SECURE_TOKEN_VALID";

export async function createVaultVerifier(key: CryptoKey): Promise<{ verifier: string; iv: string }> {
  const res = await encryptText(CANARY_STRING, key);
  return { verifier: res.ciphertext, iv: res.iv };
}

export async function checkVaultVerifier(
  verifier: string,
  iv: string,
  key: CryptoKey
): Promise<boolean> {
  try {
    const decrypted = await decryptText(verifier, iv, key);
    return decrypted === CANARY_STRING;
  } catch {
    return false;
  }
}

export interface PasswordGeneratorOptions {
  length: number;
  useUpper: boolean;
  useLower: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
}

export function generatePassword(options: PasswordGeneratorOptions): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+~|}{[]:;?><,.-=";

  let pool = "";
  if (options.useUpper) pool += upper;
  if (options.useLower) pool += lower;
  if (options.useNumbers) pool += numbers;
  if (options.useSymbols) pool += symbols;

  if (!pool) pool = lower + numbers;

  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  let result = "";
  for (let i = 0; i < options.length; i++) {
    result += pool[array[i] % pool.length];
  }

  return result;
}
