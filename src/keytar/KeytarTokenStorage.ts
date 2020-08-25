import keytar from 'keytar'
import { TokenStorage } from '../TokenStorage'

const SERVICE = 'hyu'
const ACCOUNT = 'GitHub Personal Access Token for Hyu'

/**
 * Token storage implementation using Keytar.
 */
export class KeytarTokenStorage implements TokenStorage {
  getToken(): Promise<string | null> {
    return keytar.getPassword(SERVICE, ACCOUNT)
  }

  async setToken(token: string): Promise<void> {
    await keytar.setPassword(SERVICE, ACCOUNT, token)
  }
}
