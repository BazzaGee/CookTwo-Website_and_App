// Minimal ambient types for Node's built-in sqlite module (node:sqlite),
// used by the test D1 helper. Only the surface we actually use is declared.
declare module 'node:sqlite' {
  export interface StatementResultingChanges {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  }
  export interface StatementSync {
    run(...anonymousParameters: unknown[]): StatementResultingChanges;
    all(...anonymousParameters: unknown[]): unknown[];
    get(...anonymousParameters: unknown[]): unknown;
  }
  export class DatabaseSync {
    constructor(path: string, options?: { open?: boolean });
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
  }
}
