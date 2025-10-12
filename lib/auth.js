import { getDb } from './mongodb';

// Check authentication
export function checkAuth(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || authHeader !== 'Bearer demo-admin-token') {
    return { authenticated: false };
  }
  
  return { authenticated: true, user: { id: '1', username: 'admin', role: 'super_admin' } };
}

// Create session
export async function createSession(username, password) {
  try {
    const db = await getDb();
    
    // Check if user exists in database
    const user = await db.collection('admins').findOne({ username });
    
    if (user && password === 'atlas2025') { // Şimdilik basit check, sonra bcrypt ekleriz
      const token = 'demo-admin-token';
      
      // Update user with token
      await db.collection('admins').updateOne(
        { username },
        { 
          $set: { 
            token, 
            lastLogin: new Date() 
          } 
        }
      );
      
      return {
        success: true,
        token,
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          role: user.role || 'super_admin'
        }
      };
    }
    
    // Fallback to demo credentials
    if (username === 'admin' && password === 'atlas2025') {
      return {
        success: true,
        token: 'demo-admin-token',
        user: { id: '1', username: 'admin', role: 'super_admin' }
      };
    }
    
  } catch (error) {
    console.error('Auth error:', error);
  }
  
  return { success: false, error: 'Ongeldige gebruikersnaam of wachtwoord' };
}
