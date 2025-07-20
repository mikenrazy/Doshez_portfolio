export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  profile_image_url?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioContent {
  id: string;
  section: string;
  content_key: string;
  content_value: any;
  admin_id?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaUpload {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  file_path: string;
  upload_type: 'profile' | 'project' | 'general';
  admin_id?: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AdminUser;
  message?: string;
}