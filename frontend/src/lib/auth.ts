export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return null;
    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = atob(padded);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getIsAdminFromToken(token: string): boolean {
  const payload = decodeJwtPayload(token);
  return Boolean(payload?.is_admin);
}
