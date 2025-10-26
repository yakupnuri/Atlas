// Script to fix badge objects in hero_slides collection
const { MongoClient } = require('mongodb');

async function fixBadges() {
  const client = new MongoClient(process.env.MONGO_URL);
  
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'stichting_atlas');
    const collection = db.collection('hero_slides');
    
    // Get all slides
    const slides = await collection.find({}).toArray();
    
    console.log(`Found ${slides.length} slides`);
    
    for (const slide of slides) {
      const updates = {};
      
      // Fix badge if it exists but is not in correct format
      if (slide.badge) {
        if (typeof slide.badge !== 'object' || Array.isArray(slide.badge)) {
          updates.badge = { text: '', color: 'blue', enabled: false };
          console.log(`Fixing badge for slide: ${slide.title}`);
        } else if (!slide.badge.hasOwnProperty('enabled')) {
          updates.badge = {
            text: slide.badge.text || '',
            color: slide.badge.color || 'blue',
            enabled: false
          };
          console.log(`Adding enabled field to badge for slide: ${slide.title}`);
        }
      } else {
        // Add default badge if missing
        updates.badge = { text: '', color: 'blue', enabled: false };
        console.log(`Adding default badge to slide: ${slide.title}`);
      }
      
      if (Object.keys(updates).length > 0) {
        await collection.updateOne(
          { _id: slide._id },
          { $set: updates }
        );
      }
    }
    
    console.log('✅ Badge fix completed!');
  } catch (error) {
    console.error('Error fixing badges:', error);
  } finally {
    await client.close();
  }
}

fixBadges();
