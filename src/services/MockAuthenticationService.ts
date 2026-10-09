import { AdminUser } from '../types';
import { AuthenticationService } from '../repositories/interfaces';

const AUTH_STORAGE_KEY = 'leghari_motors_auth_session_v1';

export class MockAuthenticationService implements AuthenticationService {
  async getCurrentUser(): Promise<AdminUser | null> {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  }

  async login(username: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const trimmed = username.trim().toLowerCase();

    // Verify authorized admin username: 'shahidlegahrii'
    if (trimmed !== 'shahidlegahrii') {
      return {
        success: false,
        error: 'Access denied. Only registered administrator username "shahidlegahrii" is authorized.',
      };
    }

    const adminUser: AdminUser = {
      username: 'shahidlegahrii',
      displayName: 'Shahid Leghari',
      role: 'owner',
      isDemoAuth: true,
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
    } catch {
      // ignore
    }

    return {
      success: true,
      user: adminUser,
    };
  }

  async logout(): Promise<void> {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null && user.username === 'shahidlegahrii';
  }
}

export const authService = new MockAuthenticationService();
