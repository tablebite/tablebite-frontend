// src/Services/auth.js
export async function signIn({ email, password }) {
  console.log('[DevStub] signIn called with:', { email, password });

  const e = String(email || '').trim().toLowerCase();
  const p = String(password || '').trim();
  console.log('[DevStub] normalized to:', { e, p });

  if (e === 'admin@gmail.com' && p === 'admin') {
    return {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImFkbWluQGdtYWlsLmNvbSIsImV4cCI6NDA3MDkwODgwMH0.' +
        'dummy-signature'
    };
  }

  throw new Error('Invalid credentials');
}
