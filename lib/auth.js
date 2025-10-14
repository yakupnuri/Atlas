import { getDb } from './mongodb';
import bcrypt from 'bcryptjs';

// Check authentication
export function checkAuth(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false };
  }
  
  const token = authHeader.substring(7);
  
  if (!token) {
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
    
    if (!user) {
      return { success: false, error: 'Ongeldige gebruikersnaam of wachtwoord' };
    }
    
    // Verify password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return { success: false, error: 'Ongeldige gebruikersnaam of wachtwoord' };
    }
    
    // Generate token (in production, use JWT)
    const token = `token-${user.id}-${Date.now()}`;
    
    // Update user with token and last login
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
    
  } catch (error) {
    console.error('Auth error:', error);
    return { success: false, error: 'Server hatası' };
  }
}
