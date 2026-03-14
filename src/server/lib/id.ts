import { ulid } from "ulid";

export namespace IdUtils {
  export function createPrefixedUlid(prefix: string): string {
    return `${prefix}_${ulid()}`;
  }

  export function isPrefixedUlid(prefix: string, value: string): boolean {
    const expression = new RegExp(`^${prefix}_[0-9A-HJKMNP-TV-Z]{26}$`);
    return expression.test(value);
  }
}
