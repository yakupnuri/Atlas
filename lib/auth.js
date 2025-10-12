// Simple auth helper for demo
export function checkAuth(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || authHeader !== 'Bearer demo-admin-token') {
    return { authenticated: false };
  }
  
  return { authenticated: true, user: { id: '1', username: 'admin', role: 'admin' } };
}

export function createSession(username, password) {
  // Demo credentials
  if (username === 'admin' && password === 'atlas2025') {
    return {
      success: true,
      token: 'demo-admin-token',
      user: { id: '1', username: 'admin', role: 'admin' }
    };
  }
  
  return { success: false, error: 'Ongeldige gebruikersnaam of wachtwoord' };
}
