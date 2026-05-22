import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { HardDrive } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'popup',
    redirectUri: 'https://jtrjnycowv3o.space.minimax.io/auth/callback',
    onSuccess: async (codeResponse) => {
      setIsLoading(true);
      setError(null);

      try {
        // Exchange the auth code for a Supabase session
        const { data, error: supabaseError } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          id_token: codeResponse.code,
          nonce: undefined, // Optional nonce for additional security
        });

        if (supabaseError) {
          throw supabaseError;
        }

        if (data.user) {
          const user: User = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email || '',
            picture: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || '',
          };
          onLogin(user);
        }
      } catch (err: any) {
        console.error('Login error:', err);
        setError(err.message || 'Failed to sign in. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Google OAuth error:', errorResponse);
      setError('Google sign-in was cancelled or failed. Please try again.');
      setIsLoading(false);
    }
  });

  const handleDemoLogin = () => {
    // Simulate Google login for demo
    const mockUser: User = {
      id: 'demo-' + Date.now(),
      name: 'Demo User',
      email: 'demo@cloudvault.io',
      picture: 'https://www.gravatar.com/avatar/?d=mp&s=100',
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 px-8 py-12 text-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <HardDrive className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CloudVault</h1>
          <p className="text-red-100 text-sm">Unlimited Cloud Storage</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Sign in to access your files
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={() => login()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="font-medium text-gray-700">
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Demo Notice */}
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">
              <button
                onClick={handleDemoLogin}
                className="font-semibold text-red-600 hover:underline"
              >
                Demo Mode
              </button>
              <br />
              Click here for instant demo access
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">∞</div>
              <div className="text-xs text-gray-500">Storage</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">0</div>
              <div className="text-xs text-gray-500">File Size Limit</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">E2E</div>
              <div className="text-xs text-gray-500">Encryption</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}