import api from './axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthUser[];
  errors: string[];
  errorCode: number;
  timestamp: number;
}

interface AuthUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
  refreshToken: string;
  accessToken: string;
}


export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/signin', credentials);
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.data[0].accessToken);
      localStorage.setItem('refreshToken', response.data.data[0].refreshToken);
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  async logout(): Promise<void> {
    try {
      // Remove tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
  
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },
  
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
};