interface UpdateParams {
  table: string;
  data: Record<string, any>;
  where: Record<string, any>;
}

export function buildUpdateQuery({ table, data, where }: UpdateParams): { query: string; values: any[] } {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  // Building SET clause
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      updates.push(`${key} = $${paramCount++}`);
      values.push(value);
    }
  }

  if (updates.length === 0) {
    throw new Error('No fields to update');
  }

  // Adding updated_at field
  updates.push('updated_at = NOW()');

  // building WHERE clause
  const whereClauses: string[] = [];
  for (const [key, value] of Object.entries(where)) {
    whereClauses.push(`${key} = $${paramCount++}`);
    values.push(value);
  }

  const query = `
    UPDATE ${table}
    SET ${updates.join(', ')}
    WHERE ${whereClauses.join(' AND ')}
    RETURNING *
  `;

  return { query, values };
}
