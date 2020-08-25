/**
 * Token storage.
 */
export interface TokenStorage {
  getToken(): Promise<string | null>
  setToken(token: string): Promise<void>
}
