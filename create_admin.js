const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  const client = new MongoClient(process.env.MONGO_URL);
  
  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    const db = client.db();
    
    // Yeni admin bilgileri
    const username = 'admin';
    const password = 'Atlas@2025!';
    const email = 'admin@stichtingatlas.nl';
    
    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✓ Password hashed');
    
    // Eski admin'i sil
    await db.collection('admins').deleteMany({ username: 'admin' });
    console.log('✓ Old admin users deleted');
    
    // Yeni admin kullanıcısı oluştur
    const adminUser = {
      id: '1',
      username: username,
      password: hashedPassword,
      email: email,
      role: 'super_admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('admins').insertOne(adminUser);
    console.log('✓ New admin user created');
    
    console.log('\n========================================');
    console.log('Admin kullanıcısı başarıyla oluşturuldu!');
    console.log('========================================');
    console.log('Kullanıcı Adı:', username);
    console.log('Şifre:', password);
    console.log('Email:', email);
    console.log('Rol: super_admin');
    console.log('========================================\n');
    
  } catch (error) {
    console.error('✗ Error:', error);
  } finally {
    await client.close();
    console.log('✓ Connection closed');
  }
}

createAdmin();
