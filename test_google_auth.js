const { MongoClient } = require('mongodb');

async function testGoogleAuth() {
  const MONGO_URL = 'mongodb://localhost:27017/stichting_atlas';
  const client = new MongoClient(MONGO_URL);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Tüm admin emaillerini listele
    const admins = await db.collection('admins').find({}).project({ email: 1, username: 1, role: 1 }).toArray();
    
    console.log('\n========================================');
    console.log('YETKİLİ GOOGLE HESAPLARI (Admin Listesi)');
    console.log('========================================');
    
    if (admins.length === 0) {
      console.log('Henüz hiç admin kullanıcısı yok!');
    } else {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.email} (${admin.username}) - ${admin.role}`);
      });
    }
    
    console.log('\n========================================');
    console.log('GOOGLE İLE GİRİŞ KURALLARI:');
    console.log('========================================');
    console.log('✅ Yukarıdaki email adresleri Google ile giriş yapabilir');
    console.log('❌ Diğer Google hesapları giriş yapamaz');
    console.log('\nYeni kullanıcı eklemek için:');
    console.log('Admin Panel → Kullanıcılar → Yeni Kullanıcı Ekle');
    console.log('========================================\n');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testGoogleAuth();
