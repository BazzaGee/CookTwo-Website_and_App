export interface ParseCacheEntry {
  inputHash: string;
  rawInput: string;
  parsedJson: string;
  source: 'regex' | 'ai';
  createdAt: number;
}

const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export async function getCachedParse(
  sql: DurableObjectStorage['sql'],
  inputHash: string,
): Promise<ParseCacheEntry | null> {
  try {
    const cursor = sql.exec<ParseCacheEntry>('SELECT * FROM pantry_parse_cache WHERE input_hash = ?', inputHash);
    const rows = Array.from(cursor);
    const result = rows[0];
    
    if (!result) return null;
    
    // Check TTL
    if (Date.now() - result.createdAt > CACHE_TTL) {
      sql.exec('DELETE FROM pantry_parse_cache WHERE input_hash = ?', inputHash);
      return null;
    }
    
    return result;
  } catch {
    return null;
  }
}

export async function cacheParse(
  sql: DurableObjectStorage['sql'],
  entry: ParseCacheEntry,
): Promise<void> {
  try {
    sql.exec(
      'INSERT OR REPLACE INTO pantry_parse_cache (input_hash, raw_input, parsed_json, source, created_at) VALUES (?, ?, ?, ?, ?)',
      entry.inputHash,
      entry.rawInput,
      entry.parsedJson,
      entry.source,
      entry.createdAt,
    );
  } catch {
    // Cache write failure is non-critical
  }
}

export async function cleanExpiredCache(
  sql: DurableObjectStorage['sql'],
): Promise<void> {
  try {
    const cutoff = Date.now() - CACHE_TTL;
    sql.exec('DELETE FROM pantry_parse_cache WHERE created_at < ?', cutoff);
  } catch {
    // Cleanup failure is non-critical
  }
}
