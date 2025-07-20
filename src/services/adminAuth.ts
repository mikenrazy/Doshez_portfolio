import { supabase } from '../lib/supabase';
import type { LoginCredentials, AuthResponse, AdminUser } from '../types/admin';

class AdminAuthService {
  private readonly ADMIN_EMAIL = 'odongonmichael@gmail.com';
  private readonly ADMIN_PASSWORD = 'T@tu2025';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simple credential check for demo purposes
      if (credentials.email === this.ADMIN_EMAIL && credentials.password === this.ADMIN_PASSWORD) {
        // Get or create admin user
        let { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (error && error.code === 'PGRST116') {
          // User doesn't exist, create them
          const { data: newUser, error: createError } = await supabase
            .from('admin_users')
            .insert({
              email: credentials.email,
              password_hash: 'hashed_password', // In production, use proper hashing
              full_name: 'Michael Odongo',
              last_login: new Date().toISOString()
            })
            .select()
            .single();

          if (createError) {
            return { success: false, message: 'Failed to create admin user' };
          }
          adminUser = newUser;
        } else if (error) {
          return { success: false, message: 'Authentication failed' };
        }

        // Update last login
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', adminUser.id);

        // Generate simple token (in production, use JWT)
        const token = btoa(JSON.stringify({ 
          id: adminUser.id, 
          email: adminUser.email, 
          exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }));

        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(adminUser));

        return {
          success: true,
          token,
          user: adminUser
        };
      }

      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }

  getCurrentUser(): AdminUser | null {
    try {
      const userStr = localStorage.getItem('admin_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return false;

      const decoded = JSON.parse(atob(token));
      return decoded.exp > Date.now();
    } catch {
      return false;
    }
  }

  async updateProfile(updates: Partial<AdminUser>): Promise<boolean> {
    try {
      const user = this.getCurrentUser();
      if (!user) return false;

      const { error } = await supabase
        .from('admin_users')
        .update(updates)
        .eq('id', user.id);

      if (!error) {
        // Update local storage
        const updatedUser = { ...user, ...updates };
        localStorage.setItem('admin_user', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  }
}

export const adminAuth = new AdminAuthService();