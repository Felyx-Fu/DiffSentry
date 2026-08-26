export function authenticateUser(token: string): boolean {
  return token.length > 0;
}
