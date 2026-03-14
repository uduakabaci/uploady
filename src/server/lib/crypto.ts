export namespace CryptoUtils {
  function toHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  function toBase64Url(bytes: Uint8Array): string {
    const binary = String.fromCharCode(...bytes);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  export function createOpaqueToken(bytesLength = 32): string {
    const bytes = crypto.getRandomValues(new Uint8Array(bytesLength));
    return toBase64Url(bytes);
  }

  export async function sha256Hex(value: string): Promise<string> {
    const input = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", input);
    return toHex(new Uint8Array(digest));
  }
}
