const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'stichting_atlas';

async function seedCRMUsers() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection('crm_users');

    // Clear existing CRM users
    await collection.deleteMany({});
    console.log('🗑️  Cleared existing CRM users');

    // Create demo CRM users (volunteers)
    const demoUsers = [
      {
        email: 'volunteer1@example.com',
        name: 'Ahmet Yılmaz',
        password: await bcrypt.hash('password123', 10),
        role: 'volunteer',
        firstLogin: true,
        createdAt: new Date(),
      },
      {
        email: 'volunteer2@example.com',
        name: 'Fatma Demir',
        password: await bcrypt.hash('password123', 10),
        role: 'volunteer',
        firstLogin: true,
        createdAt: new Date(),
      },
      {
        email: 'coordinator@example.com',
        name: 'Mehmet Kaya',
        password: await bcrypt.hash('password123', 10),
        role: 'coordinator',
        firstLogin: false,
        createdAt: new Date(),
      },
    ];

    const result = await collection.insertMany(demoUsers);
    console.log(`✅ Created ${result.insertedCount} CRM users`);
    
    console.log('\n📋 Demo CRM Credentials:');
    console.log('========================');
    demoUsers.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: password123`);
      console.log(`Role: ${user.role}`);
      console.log('------------------------');
    });

  } catch (error) {
    console.error('❌ Error seeding CRM users:', error);
  } finally {
    await client.close();
    console.log('✅ Database connection closed');
  }
}

seedCRMUsers();
