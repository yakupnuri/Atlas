import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail, generateReservationEmail } from '@/lib/email';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request) {
  const { pathname, searchParams } = new URL(request.url);
  
  try {
    const db = await getDb();

    // Health check
    if (pathname === '/api' || pathname === '/api/') {
      return NextResponse.json(
        { message: 'Stichting Atlas API - Welkom!' },
        { headers: corsHeaders }
      );
    }

    // Get all events
    if (pathname === '/api/events') {
      const category = searchParams.get('category');
      const upcoming = searchParams.get('upcoming');
      
      let query = {};
      
      if (category && category !== 'all') {
        query.category = category;
      }
      
      if (upcoming === 'true') {
        query.startAt = { $gte: new Date().toISOString() };
      }
      
      const events = await db.collection('events')
        .find(query)
        .sort({ startAt: 1 })
        .toArray();
      
      return NextResponse.json({ events }, { headers: corsHeaders });
    }

    // Get single event by slug
    if (pathname.startsWith('/api/events/')) {
      const slug = pathname.replace('/api/events/', '');
      const event = await db.collection('events').findOne({ slug });
      
      if (!event) {
        return NextResponse.json(
          { error: 'Evenement niet gevonden' },
          { status: 404, headers: corsHeaders }
        );
      }
      
      // Get reservations count
      const reservations = await db.collection('reservations')
        .find({ eventId: event.id, status: 'confirmed' })
        .toArray();
      
      const reservedCount = reservations.reduce((sum, r) => sum + r.count, 0);
      const available = event.capacity - reservedCount;
      
      return NextResponse.json(
        { event, reservedCount, available },
        { headers: corsHeaders }
      );
    }

    // Get reservations for an event
    if (pathname === '/api/reservations') {
      const eventId = searchParams.get('eventId');
      
      let query = {};
      if (eventId) {
        query.eventId = eventId;
      }
      
      const reservations = await db.collection('reservations')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
      
      return NextResponse.json({ reservations }, { headers: corsHeaders });
    }

    return NextResponse.json(
      { error: 'Endpoint niet gevonden' },
      { status: 404, headers: corsHeaders }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request) {
  const { pathname } = new URL(request.url);
  
  try {
    const db = await getDb();
    
    let body = {};
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch (e) {
      // Empty body is ok for some endpoints
    }

    // Create reservation
    if (pathname === '/api/reservations') {
      const { eventId, name, email, count, notes } = body;
      
      // Validate
      if (!eventId || !name || !email || !count) {
        return NextResponse.json(
          { error: 'Vul alle verplichte velden in' },
          { status: 400, headers: corsHeaders }
        );
      }
      
      // Check event exists and has capacity
      const event = await db.collection('events').findOne({ id: eventId });
      if (!event) {
        return NextResponse.json(
          { error: 'Evenement niet gevonden' },
          { status: 404, headers: corsHeaders }
        );
      }
      
      // Check capacity
      const existingReservations = await db.collection('reservations')
        .find({ eventId, status: 'confirmed' })
        .toArray();
      
      const reservedCount = existingReservations.reduce((sum, r) => sum + r.count, 0);
      const available = event.capacity - reservedCount;
      
      if (count > available) {
        return NextResponse.json(
          { error: `Helaas, er zijn nog maar ${available} plaatsen beschikbaar` },
          { status: 400, headers: corsHeaders }
        );
      }
      
      // Create reservation
      const reservation = {
        id: uuidv4(),
        eventId,
        name,
        email,
        count: parseInt(count),
        notes: notes || '',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      
      await db.collection('reservations').insertOne(reservation);
      
      // Send confirmation email
      const emailContent = generateReservationEmail({
        name,
        eventTitle: event.title,
        eventDate: event.startAt,
        count,
        reservationId: reservation.id,
      });
      
      await sendEmail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      });
      
      return NextResponse.json(
        { 
          reservation, 
          message: 'Reservering succesvol! Check je email voor bevestiging.' 
        },
        { headers: corsHeaders }
      );
    }

    // Seed demo data
    if (pathname === '/api/seed') {
      // Clear existing data
      await db.collection('events').deleteMany({});
      await db.collection('reservations').deleteMany({});
      await db.collection('news').deleteMany({});
      
      // Create demo events
      const now = new Date();
      const demoEvents = [
        {
          id: uuidv4(),
          title: 'Soepdag - Samen eten, samen delen',
          slug: 'soepdag-januari',
          description: 'Kom genieten van een heerlijke warme maaltijd in gezellige sfeer. Iedereen is welkom! We serveren traditionele soepen en broodjes. Een moment om samen te komen en elkaar te ontmoeten.',
          startAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          endAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
          locationName: 'Gemeenschapshuis De Brug',
          address: 'Hoofdstraat 45, Amsterdam',
          lat: 52.3676,
          lng: 4.9041,
          capacity: 50,
          price: 0,
          isPaid: false,
          category: 'soepdag',
          bannerImage: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
          status: 'published',
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: 'Weekendonderwijs - Culturele Lessen',
          slug: 'weekendonderwijs-maart',
          description: 'Onze weekendschool biedt kinderen de kans om hun culturele achtergrond te ontdekken en te ontwikkelen. Met lessen in taal, geschiedenis en tradities. Voor kinderen van 6-14 jaar.',
          startAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          endAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
          locationName: 'Atlas Cultuurcentrum',
          address: 'Schoolstraat 12, Amsterdam',
          lat: 52.3702,
          lng: 4.8952,
          capacity: 30,
          price: 0,
          isPaid: false,
          category: 'educatie',
          bannerImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
          status: 'published',
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: 'Iedereen Welkom Festival',
          slug: 'iedereen-welkom-festival',
          description: 'Een dag vol muziek, dans, kunst en cultuur! Kom kennismaken met verschillende culturen door middel van workshops, optredens en lekker eten. Voor het hele gezin.',
          startAt: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          endAt: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
          locationName: 'Park Centrum',
          address: 'Parkweg 100, Amsterdam',
          lat: 52.3547,
          lng: 4.9138,
          capacity: 200,
          price: 0,
          isPaid: false,
          category: 'festival',
          bannerImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
          status: 'published',
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: 'Vrouwen & Gezin Bijeenkomst',
          slug: 'vrouwen-gezin-april',
          description: 'Een ontmoetingsmoment voor vrouwen om ervaringen te delen, te leren en elkaar te ondersteunen. Met workshops over opvoeding, gezondheid en welzijn.',
          startAt: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString(),
          endAt: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000).toISOString(),
          locationName: 'Wijkcentrum Zuid',
          address: 'Zuidlaan 78, Amsterdam',
          lat: 52.3385,
          lng: 4.8722,
          capacity: 40,
          price: 0,
          isPaid: false,
          category: 'vrouwen-gezin',
          bannerImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
          status: 'published',
          createdAt: new Date().toISOString(),
        },
      ];
      
      await db.collection('events').insertMany(demoEvents);
      
      // Demo news articles
      const demoNews = [
        {
          id: uuidv4(),
          title: 'Ramazan İftar Programı Başarıyla Tamamlandı',
          slug: 'ramazan-iftar-programi-basariyla-tamamlandi',
          excerpt: 'Bu yılki Ramazan ayında düzenlediğimiz iftar programlarına 150\'den fazla kişi katıldı.',
          content: 'Bu yılki Ramazan ayında düzenlediğimiz iftar programları büyük bir başarıyla tamamlandı. Her gün düzenlenen iftar yemeklerine toplam 150\'den fazla kişi katıldı.\\n\\nProgram boyunca misafirlerimize geleneksel Türk mutfağından çeşitli lezzetler sunuldu. Etkinliğimiz, farklı kültürlerden insanların bir araya gelip birlikte yemek yediği, sohbet ettiği ve dostluklar kurduğu özel bir atmosfere sahipti.\\n\\nKatılımcılardan gelen geri bildirimler oldukça olumlu oldu. Gelecek yıl da bu programı tekrarlamayı planlıyoruz.',
          date: '2025-04-15',
          author: 'Fatma Demir',
          category: 'Etkinlik',
          image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800',
          gallery: [
            'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400',
            'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400',
            'https://images.unsplash.com/photo-1544025162-d76694265947?w=400'
          ],
          commentsEnabled: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: 'Yeni Ders Yemeği Programı Başlıyor',
          slug: 'yeni-ders-yemegi-programi-basliyor',
          excerpt: 'Öğrenciler ve aileler için her Cumartesi düzenlenen eğitici yemek programımız başlıyor.',
          content: 'Öğrenciler ve aileler için özel olarak tasarlanmış Ders Yemeği programımız başlıyor! Her Cumartesi saat 12:00-15:00 arasında düzenlenecek bu program, hem eğitici hem de eğlenceli aktiviteler içeriyor.\\n\\nProgram kapsamında:\\n- Sağlıklı beslenme eğitimi\\n- Birlikte yemek pişirme atölyeleri\\n- Kültürel yemek tarifleri\\n- Aile bağlarını güçlendirici aktiviteler\\n\\nKayıtlar başladı! Sınırlı kontenjan.',
          date: '2025-03-22',
          author: 'Mehmet Kaya',
          category: 'Eğitim',
          image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
          gallery: [],
          commentsEnabled: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: 'Weekendonderwijs Kayıtları Başladı',
          slug: 'weekendonderwijs-kayitlari-basladi',
          excerpt: 'Hafta sonu okulumuzun yeni dönemi için kayıtlar açıldı. Şimdi kaydolun!',
          content: 'Weekendonderwijs (Hafta Sonu Okulu) programımızın yeni dönem kayıtları başladı! 6-14 yaş arası çocuklar için düzenlenen bu program, kültürel eğitim ve dil gelişimi odaklıdır.\\n\\nProgram içeriği:\\n- Türkçe dil eğitimi\\n- Kültürel değerler\\n- Sanat ve müzik\\n- Sosyal aktiviteler\\n\\nDersler her Cumartesi ve Pazar günleri yapılacaktır.',
          date: '2025-03-10',
          author: 'Ayşe Öztürk',
          category: 'Eğitim',
          image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
          gallery: [],
          commentsEnabled: false,
          createdAt: new Date().toISOString(),
        }
      ];
      
      await db.collection('news').insertMany(demoNews);
      
      return NextResponse.json(
        { message: 'Demo data succesvol aangemaakt!', events: demoEvents.length, news: demoNews.length },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: 'Endpoint niet gevonden' },
      { status: 404, headers: corsHeaders }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(request) {
  return NextResponse.json(
    { error: 'PUT method not implemented yet' },
    { status: 501, headers: corsHeaders }
  );
}

export async function DELETE(request) {
  return NextResponse.json(
    { error: 'DELETE method not implemented yet' },
    { status: 501, headers: corsHeaders }
  );
}
