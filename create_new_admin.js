const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createNewAdmin() {
  const MONGO_URL = 'mongodb://localhost:27017/stichting_atlas';
  const client = new MongoClient(MONGO_URL);
  
  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    const db = client.db();
    
    // Yeni admin bilgileri - basit şifre
    const username = 'superadmin';
    const password = 'admin123';
    const email = 'superadmin@stichtingatlas.nl';
    
    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✓ Password hashed');
    
    // Eski superadmin'i sil
    await db.collection('admins').deleteMany({ username: 'superadmin' });
    console.log('✓ Old superadmin deleted');
    
    // Yeni admin kullanıcısı oluştur
    const adminUser = {
      id: 'admin-super-001',
      username: username,
      password: hashedPassword,
      email: email,
      role: 'super_admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('admins').insertOne(adminUser);
    console.log('✓ New super admin user created');
    
    // Tüm admin kullanıcılarını listele
    console.log('\n========================================');
    console.log('MEVCUT TÜM ADMIN KULLANICILAR:');
    console.log('========================================');
    const allAdmins = await db.collection('admins').find({}).toArray();
    allAdmins.forEach(admin => {
      console.log(`- Kullanıcı: ${admin.username}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Rol: ${admin.role}`);
      console.log('');
    });
    
    console.log('========================================');
    console.log('YENİ GİRİŞ BİLGİLERİ:');
    console.log('========================================');
    console.log('Kullanıcı Adı: superadmin');
    console.log('Şifre: admin123');
    console.log('Email:', email);
    console.log('========================================\n');
    
  } catch (error) {
    console.error('✗ Error:', error);
  } finally {
    await client.close();
    console.log('✓ Connection closed');
  }
}

createNewAdmin();
