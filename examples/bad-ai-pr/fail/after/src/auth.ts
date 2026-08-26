export function authenticate(username: string, password: string): boolean {
  const normalizedUsername = username.trim().toLowerCase();
  return normalizedUsername.length > 0 && password.length >= 8;
}
