// Supabase-like auth client without external dependencies
// Implements Google OAuth flow using standard fetch API

const SUPABASE_URL = 'https://uvfgfgmjnbuwyobupfip.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2ZmdmZ21qbmJ1d3lvYnVwZmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzc3NTcsImV4cCI6MjA5NDk1Mzc1N30.KxcRUyBudAAKyc-_JaI9Ibzsy-VFrWgKJBjOVD-zAc4';
const GOOGLE_CLIENT_ID = '466158961924-i5drhg44t074livan7nbkt3talha12m6.apps.googleusercontent.com';
const REDIRECT_URI = 'https://jtrjnycowv3o.space.minimax.io';

// Generate random string for state parameter
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Session management
export function getSession() {
  const stored = localStorage.getItem('cloudvault-session');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

export function saveSession(session: any) {
  localStorage.setItem('cloudvault-session', JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem('cloudvault-session');
}

// Google OAuth functions
export async function signInWithGooglePopup(): Promise<any> {
  const state = generateRandomString(32);
  const nonce = generateRandomString(32);
  sessionStorage.setItem('oauth_state', state);
  sessionStorage.setItem('oauth_nonce', nonce);

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI + '/auth/callback.html');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'email profile openid');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('nonce', nonce);
  authUrl.searchParams.set('prompt', 'select_account consent');

  return new Promise((resolve, reject) => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl.toString(),
      'GoogleSignIn',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const messageHandler = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        window.removeEventListener('message', messageHandler);
        if (popup) popup.close();
        resolve(event.data.user);
      } else if (event.data?.type === 'GOOGLE_AUTH_ERROR') {
        window.removeEventListener('message', messageHandler);
        if (popup) popup.close();
        reject(new Error(event.data.error));
      }
    };

    window.addEventListener('message', messageHandler);

    // Check if popup was closed
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
        reject(new Error('Authentication cancelled'));
      }
    }, 1000);

    // 5 minute timeout
    setTimeout(() => {
      clearInterval(checkClosed);
      window.removeEventListener('message', messageHandler);
      popup?.close();
      reject(new Error('Authentication timeout'));
    }, 300000);
  });
}

// Supabase-compatible client
export const supabase = {
  auth: {
    signInWithIdToken: async ({ provider, id_token }: { provider: string; id_token: string }) => {
      if (provider === 'google' && id_token) {
        try {
          // Verify with Supabase or get user info
          const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${id_token}` }
          });

          if (userInfoRes.ok) {
            const userInfo = await userInfoRes.json();
            const session = {
              user: {
                id: userInfo.sub,
                email: userInfo.email,
                user_metadata: {
                  full_name: userInfo.name,
                  avatar_url: userInfo.picture,
                  picture: userInfo.picture,
                }
              },
              access_token: id_token,
            };
            saveSession(session);
            return { data: session, error: null };
          }
        } catch (e: any) {
          return { data: null, error: { message: e.message } };
        }
      }
      return { data: null, error: { message: 'Invalid provider' } };
    },
    getSession: () => {
      return { data: { session: getSession() }, error: null };
    },
    signOut: () => {
      clearSession();
      return { error: null };
    }
  }
};

export { GOOGLE_CLIENT_ID, REDIRECT_URI };