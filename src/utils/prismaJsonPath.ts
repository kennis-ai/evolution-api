import { configService, Database } from '@config/env.config';

/**
 * Prisma's JSON `path` filter is provider-shaped: PostgreSQL expects an array of
 * segments (`['fromMe']`), MySQL expects a JSONPath string (`'$.fromMe'`).
 *
 * Commit 40879625 ("resolve JSON path typing and MySQL compatibility") gated the raw
 * SQL by provider but switched every Prisma `path` filter to the MySQL form
 * unconditionally. On PostgreSQL every one of them then threw
 * `PrismaClientValidationError: Argument 'path': Expected String[], provided String`
 * — silently breaking, among others, the Chatwoot MESSAGE_READ path.
 *
 * Use this helper at every JSON key filter so both providers stay supported.
 */
export function jsonPath(field: string): string | string[] {
  const provider = String(configService.get<Database>('DATABASE')?.PROVIDER || '').toLowerCase();

  return provider === 'mysql' ? `$.${field}` : [field];
}
