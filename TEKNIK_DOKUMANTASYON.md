# 🏗️ STICHTING ATLAS - TEKNIK DOKÜMANTASYON
**Versiyon:** 1.0  
**Tarih:** 26 Ekim 2024  
**Deployment Hazır:** ✅

---

## 📋 İÇİNDEKİLER

1. [Proje Genel Bakış](#proje-genel-bakış)
2. [Teknoloji Stack](#teknoloji-stack)
3. [Klasör Yapısı](#klasör-yapısı)
4. [Environment Variables](#environment-variables)
5. [Database Şeması](#database-şeması)
6. [API Endpoints](#api-endpoints)
7. [Önemli Komponentler](#önemli-komponentler)
8. [Admin Panel](#admin-panel)
9. [Entegrasyonlar](#entegrasyonlar)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 PROJE GENEL BAKIŞ

### Proje Hakkında
**Stichting Atlas**, Hollanda'da faaliyet gösteren bir sivil toplum kuruluşunun resmi web sitesidir. Multi-language (NL/EN/TR) desteği olan, dinamik içerik yönetimi, etkinlik takibi, bağış sistemi ve CRM modülleri içeren full-stack bir uygulamadır.

### Temel Özellikler
- ✅ Multi-language (NL, EN, TR)
- ✅ Admin Panel (tam CRUD kontrolü)
- ✅ Haber yönetimi
- ✅ Etkinlik yönetimi
- ✅ Bağış sistemi (Stripe)
- ✅ İletişim formu
- ✅ Media Library (Unsplash entegrasyonu)
- ✅ Anket sistemi
- ✅ CRM modülleri
- ✅ Hero Slider
- ✅ Google Maps entegrasyonu

---

## 🛠️ TEKNOLOJI STACK

### Frontend
```json
{
  "framework": "Next.js 14.2.3 (App Router)",
  "react": "18.x",
  "styling": "Tailwind CSS 3.x",
  "ui-components": "Shadcn/UI",
  "animations": "Framer Motion",
  "icons": "Lucide React",
  "forms": "React Hook Form",
  "state": "React Hooks (useState, useEffect)"
}
```

### Backend
```json
{
  "runtime": "Node.js 20.x",
  "framework": "Next.js API Routes",
  "database": "MongoDB 6.x",
  "authentication": "NextAuth.js",
  "payment": "Stripe",
  "email": "Nodemailer"
}
```

### DevOps
```json
{
  "package-manager": "Yarn",
  "process-manager": "Supervisor",
  "deployment": "Kubernetes (Emergent Platform)",
  "ports": {
    "frontend": 3000,
    "backend": 3000
  }
}
```

---

## 📁 KLASÖR YAPISI

```
/app
├── .env                          # Environment variables (GİZLİ!)
├── .gitignore
├── package.json
├── yarn.lock
├── next.config.js
├── tailwind.config.js
│
├── app/                          # Next.js App Router
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Homepage
│   ├── globals.css               # Global styles
│   │
│   ├── admin/                    # Admin Panel (Protected)
│   │   ├── page.js               # Login page
│   │   ├── dashboard/            # Dashboard
│   │   ├── hero-slides/          # Hero Slider yönetimi
│   │   ├── homepage/             # Homepage ayarları
│   │   ├── nieuws/               # Haber yönetimi
│   │   ├── evenementen/          # Etkinlik yönetimi
│   │   ├── educatie/             # Eğitim merkezi
│   │   ├── kariyer/              # Kariyer merkezi
│   │   ├── contacts/             # İletişim mesajları
│   │   ├── settings/             # Genel ayarlar
│   │   └── pages/                # Sayfa yönetimi
│   │       ├── over-ons/         # Hakkımızda
│   │       └── settings/         # SEO & API ayarları
│   │
│   ├── api/                      # Backend API Routes
│   │   ├── auth/                 # Authentication
│   │   ├── news/                 # Haber API
│   │   ├── events/               # Etkinlik API
│   │   ├── contacts/             # İletişim API
│   │   ├── donations/            # Bağış API
│   │   ├── surveys/              # Anket API
│   │   ├── hero-slides/          # Hero Slider API
│   │   ├── homepage/             # Homepage API
│   │   ├── education/            # Eğitim API
│   │   ├── career/               # Kariyer API
│   │   ├── media/                # Media Library API
│   │   │   └── unsplash/         # Unsplash API
│   │   ├── stripe-config/        # Stripe config
│   │   ├── stripe-checkout/      # Stripe checkout
│   │   ├── stripe-status/        # Payment status
│   │   ├── translations/         # Çeviri API
│   │   └── crm/                  # CRM API'leri
│   │       ├── projects/
│   │       ├── volunteers/
│   │       ├── sponsors/
│   │       └── donations/
│   │
│   ├── nieuws/                   # Haber sayfaları (Public)
│   │   ├── page.js               # Liste
│   │   └── [slug]/page.js        # Detay
│   │
│   ├── evenementen/              # Etkinlik sayfaları
│   │   ├── page.js
│   │   └── [slug]/page.js
│   │
│   ├── academie/                 # Akademi bölümü
│   │   └── cultuur-educatie/     # Kültür & Eğitim
│   │
│   ├── over/page.js              # Hakkımızda
│   ├── contact/page.js           # İletişim
│   ├── doneren/                  # Bağış sayfası
│   │   ├── page.js
│   │   └── success/page.js       # Başarılı ödeme
│   └── anbi/page.js              # ANBI bilgileri
│
├── components/                   # React Components
│   ├── ui/                       # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   │
│   ├── AdminLayout.js            # Admin layout wrapper
│   ├── HeroSlider.js             # Hero slider (homepage)
│   ├── HeroCarousel.js           # Hero carousel (alternatif)
│   ├── Navbar.js                 # Main navigation
│   ├── LanguageSwitcher.js       # Dil değiştirici
│   ├── MediaLibraryModal.js      # Media seçici modal
│   ├── ShareButtons.js           # Social share butonları
│   ├── GoogleMap.js              # Google Maps component
│   │
│   ├── surveys/                  # Anket komponentleri
│   │   ├── SurveyBuilder.js
│   │   ├── SurveyCard.js
│   │   ├── SurveyModal.js
│   │   └── SurveyResults.js
│   │
│   ├── education/                # Eğitim komponentleri
│   │   ├── ArticlesSection.js
│   │   ├── VideosSection.js
│   │   ├── CoursesSection.js
│   │   ├── AnnouncementsTicker.js
│   │   └── ...
│   │
│   ├── admin/                    # Admin özel komponentler
│   │   ├── education/            # Eğitim admin tabs
│   │   └── team/                 # Takım yönetimi
│   │
│   └── about/                    # Hakkımızda bölüm komponentleri
│       ├── TeamSection.js
│       ├── MissionVisionSection.js
│       └── ...
│
├── lib/                          # Utility fonksiyonlar
│   ├── mongodb.js                # MongoDB connection
│   ├── i18n.js                   # Internationalization
│   ├── emailService.js           # Email gönderimi
│   └── surveyTemplates.js        # Anket şablonları
│
├── contexts/                     # React Contexts
│   └── LanguageContext.js        # Dil context
│
├── hooks/                        # Custom React Hooks
│   ├── useEducationData.js
│   ├── useDocumentsData.js
│   └── useAnnouncementsData.js
│
├── messages/                     # Translation files
│   ├── en.json                   # Public İngilizce
│   ├── nl.json                   # Public Hollandaca
│   ├── tr.json                   # Public Türkçe
│   ├── admin-en.json             # Admin İngilizce
│   ├── admin-nl.json             # Admin Hollandaca
│   └── admin-tr.json             # Admin Türkçe
│
└── public/                       # Static files
    ├── atlas-logo-dark.png
    └── uploads/                  # User uploads
```

---

## 🔐 ENVIRONMENT VARIABLES

### Gerekli `.env` Dosyası

```bash
# MongoDB Connection (ZORUNLU)
MONGO_URL=mongodb://localhost:27017
DB_NAME=stichting_atlas

# Next.js Public URL (ZORUNLU)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# NextAuth Secret (ZORUNLU)
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000

# Stripe (Opsiyonel - Admin'den ayarlanabilir)
# STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_SECRET_KEY=sk_test_...

# Unsplash (Opsiyonel - Admin'den ayarlanabilir)
# UNSPLASH_ACCESS_KEY=your-key

# Google Maps (Opsiyonel - Admin'den ayarlanabilir)
# GOOGLE_MAPS_API_KEY=your-key

# Email (Opsiyonel)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-password
```

### ⚠️ ÖNEMLİ NOTLAR

1. **MONGO_URL**: Production'da Emergent otomatik ayarlar
2. **DB_NAME**: Production'da Emergent otomatik ayarlar
3. **NEXT_PUBLIC_BASE_URL**: Production'da deployment URL'e göre değişir
4. **API Keys**: Admin panel `/admin/settings` üzerinden de ayarlanabilir

---

## 🗄️ DATABASE ŞEMASI

### MongoDB Collections

#### 1. **users** - Kullanıcılar
```javascript
{
  id: "uuid",
  email: "admin@stichtingatlas.com",
  password: "hashed_password",
  name: "Admin User",
  role: "admin",
  createdAt: "2024-10-26T..."
}
```

#### 2. **news** - Haberler
```javascript
{
  id: "uuid",
  title: "Haber Başlığı",
  slug: "haber-basligi",
  excerpt: "Kısa açıklama",
  content: "<p>HTML içerik</p>",
  author: "Yazar Adı",
  category: "Etkinlik" | "Eğitim" | "Duyuru",
  image: "https://...",
  featured: true | false,
  publishDate: "2024-10-26T...",
  createdAt: "2024-10-26T...",
  commentsEnabled: false
}
```

#### 3. **events** - Etkinlikler
```javascript
{
  id: "uuid",
  title: "Etkinlik Adı",
  slug: "etkinlik-adi",
  description: "Açıklama",
  category: "soepdag" | "educatie" | "festival" | "vrouwen-gezin",
  startAt: "2024-11-15T19:00:00Z",
  endAt: "2024-11-15T22:00:00Z",
  locationName: "Atlas Centrum",
  locationAddress: "Amsterdam",
  capacity: 50,
  registeredCount: 0,
  bannerImage: "https://...",
  isPaid: false,
  price: 0,
  createdAt: "2024-10-26T..."
}
```

#### 4. **hero_slides** - Hero Slider
```javascript
{
  id: "uuid",
  title: "Slide Başlık",
  subtitle: "Alt başlık",
  description: "Açıklama",
  image: "https://...",
  ctaText: "Lees Meer",
  ctaLink: "/nieuws",
  order: 0,
  isActive: true,
  createdAt: "2024-10-26T..."
}
```

#### 5. **homepage_content** - Homepage Ayarları
```javascript
{
  id: "uuid",
  type: "homepage",
  seo: {
    title: "SEO Başlık",
    description: "SEO Açıklama",
    keywords: "anahtar, kelimeler"
  },
  integrations: {
    stripe: {
      publishableKey: "pk_...",
      secretKey: "sk_...",
      mode: "test" | "live"
    },
    unsplash: {
      accessKey: "...",
      applicationName: "..."
    },
    googleMaps: {
      apiKey: "..."
    },
    googleDrive: {
      clientId: "...",
      clientSecret: "...",
      enabled: false
    }
  },
  featuredSections: {
    news: { enabled: true, count: 6 },
    events: { enabled: true, count: 4 },
    projects: { enabled: true, count: 3 }
  }
}
```

#### 6. **donations** - Bağışlar
```javascript
{
  id: "uuid",
  sessionId: "stripe_session_id",
  amount: 25.50,
  currency: "eur",
  donorName: "John Doe",
  donorEmail: "john@example.com",
  status: "pending" | "paid" | "failed",
  mode: "test" | "live",
  paymentIntent: "pi_...",
  createdAt: "2024-10-26T...",
  updatedAt: "2024-10-26T..."
}
```

#### 7. **contacts** - İletişim Mesajları
```javascript
{
  id: "uuid",
  name: "Ad Soyad",
  email: "email@example.com",
  phone: "+31...",
  subject: "Konu",
  message: "Mesaj içeriği",
  status: "new" | "read" | "replied",
  createdAt: "2024-10-26T..."
}
```

#### 8. **surveys** - Anketler
```javascript
{
  id: "uuid",
  title: "Anket Başlığı",
  module: "career" | "education" | "projects",
  questions: [
    {
      id: "uuid",
      type: "text" | "radio" | "checkbox" | "rating",
      question: "Soru metni",
      required: true,
      options: ["Seçenek 1", "Seçenek 2"]
    }
  ],
  endDate: "2024-12-31T...",
  isActive: true,
  responses: 15,
  createdAt: "2024-10-26T..."
}
```

#### 9. **survey_responses** - Anket Cevapları
```javascript
{
  id: "uuid",
  surveyId: "survey_uuid",
  answers: {
    "question_id_1": "Cevap",
    "question_id_2": ["Çoklu", "Seçim"]
  },
  userId: "user_uuid" | null,
  submittedAt: "2024-10-26T..."
}
```

#### 10. **education_content** - Eğitim İçeriği
```javascript
{
  id: "uuid",
  type: "articles" | "videos" | "courses" | "calendar" | "schedule" | "documents" | "announcements",
  title: "İçerik Başlığı",
  description: "Açıklama",
  content: "Detaylı içerik",
  media: "https://...",
  date: "2024-10-26T...",
  category: "educatie",
  isActive: true
}
```

#### 11. **career_content** - Kariyer İçeriği
```javascript
{
  id: "uuid",
  type: "jobs" | "seminars" | "announcements" | "surveys",
  title: "İçerik Başlığı",
  description: "Açıklama",
  requirements: ["Gereksinim 1", "Gereksinim 2"],
  deadline: "2024-12-31T...",
  isActive: true
}
```

#### 12. **anbi_documents** - ANBI Dökümanları
```javascript
{
  id: "uuid",
  type: "beleidsplan" | "beloningsbeleid" | "jaarrekening",
  fileName: "document.pdf",
  filePath: "/uploads/anbi/document.pdf",
  uploadDate: "2024-10-26T..."
}
```

#### 13. **media_library** - Media Kütüphanesi
```javascript
{
  id: "uuid",
  fileName: "image.jpg",
  filePath: "/uploads/media/image.jpg",
  fileSize: 102400,
  mimeType: "image/jpeg",
  source: "upload" | "unsplash",
  unsplashData: {
    id: "...",
    author: "...",
    download_location: "..."
  },
  uploadedAt: "2024-10-26T..."
}
```

#### 14. **crm_projects** - CRM Projeleri
```javascript
{
  id: "uuid",
  name: "Proje Adı",
  description: "Açıklama",
  status: "planning" | "active" | "completed",
  category: "educatie" | "cultuur" | "community",
  startDate: "2024-11-01T...",
  endDate: "2025-01-31T...",
  budget: 5000,
  teamMembers: ["user_id_1", "user_id_2"],
  createdAt: "2024-10-26T..."
}
```

#### 15. **crm_volunteers** - Gönüllüler
```javascript
{
  id: "uuid",
  name: "Ad Soyad",
  email: "volunteer@example.com",
  phone: "+31...",
  skills: ["teaching", "organizing"],
  availability: "weekends",
  status: "active" | "inactive",
  joinedAt: "2024-10-26T..."
}
```

---

## 🔌 API ENDPOINTS

### Public Endpoints (Authentication: Yok)

#### News (Haberler)
```
GET    /api/news                    # Tüm haberler
GET    /api/news?slug=haber-slug    # Slug'a göre haber
POST   /api/news                    # Yeni haber (Admin only)
PUT    /api/news?id=uuid            # Haber güncelle (Admin only)
DELETE /api/news?id=uuid            # Haber sil (Admin only)
```

#### Events (Etkinlikler)
```
GET    /api/events                       # Tüm etkinlikler
GET    /api/events?upcoming=true         # Yaklaşan etkinlikler
GET    /api/events?category=soepdag      # Kategoriye göre
GET    /api/events?slug=etkinlik-slug    # Slug'a göre
POST   /api/events                       # Yeni etkinlik (Admin)
PUT    /api/events?id=uuid               # Güncelle (Admin)
DELETE /api/events?id=uuid               # Sil (Admin)
```

#### Hero Slides
```
GET    /api/hero-slides              # Tüm slider'lar
POST   /api/hero-slides              # Yeni slide (Admin)
PUT    /api/hero-slides?id=uuid      # Güncelle (Admin)
DELETE /api/hero-slides?id=uuid      # Sil (Admin)
```

#### Homepage
```
GET    /api/homepage                 # Homepage ayarları
PUT    /api/homepage                 # Ayarları güncelle (Admin)
```

#### Contact
```
GET    /api/contacts                 # Tüm mesajlar (Admin)
POST   /api/contacts                 # Yeni mesaj gönder (Public)
DELETE /api/contacts?id=uuid         # Mesaj sil (Admin)
```

#### Donations
```
GET    /api/donations                # Tüm bağışlar (Admin)
```

#### Stripe
```
GET    /api/stripe-config            # Stripe public key
POST   /api/stripe-checkout          # Checkout session oluştur
GET    /api/stripe-status?session_id=... # Payment durumu
```

#### Media Library
```
GET    /api/media                    # Tüm media
POST   /api/media                    # Yeni media upload
DELETE /api/media?id=uuid            # Media sil
GET    /api/media/unsplash?query=nature&page=1  # Unsplash arama
POST   /api/media/unsplash           # Unsplash'tan import
```

#### Education
```
GET    /api/education?type=articles  # Eğitim içeriği
POST   /api/education                # Yeni içerik (Admin)
PUT    /api/education                # Güncelle (Admin)
DELETE /api/education?id=uuid        # Sil (Admin)
```

#### Career
```
GET    /api/career?type=jobs         # Kariyer içeriği
POST   /api/career                   # Yeni içerik (Admin)
PUT    /api/career                   # Güncelle (Admin)
DELETE /api/career?id=uuid           # Sil (Admin)
```

#### Surveys
```
GET    /api/surveys                  # Tüm anketler
GET    /api/surveys?module=career    # Modüle göre
POST   /api/surveys                  # Yeni anket (Admin)
PUT    /api/surveys?id=uuid          # Güncelle (Admin)
DELETE /api/surveys?id=uuid          # Sil (Admin)

POST   /api/surveys/responses        # Anket cevabı gönder
GET    /api/surveys/responses?surveyId=uuid  # Anket sonuçları
```

#### Translations
```
GET    /api/translations/nl          # Hollandaca çeviriler
GET    /api/translations/en          # İngilizce çeviriler
GET    /api/translations/tr          # Türkçe çeviriler
GET    /api/translations/admin/nl    # Admin Hollandaca
```

#### ANBI
```
GET    /api/anbi                     # ANBI dokümanları
POST   /api/anbi                     # Yeni doküman (Admin)
DELETE /api/anbi?id=uuid             # Doküman sil (Admin)
```

#### Reservations
```
POST   /api/reservations             # Etkinlik rezervasyonu
GET    /api/reservations             # Tüm rezervasyonlar (Admin)
```

### Protected Endpoints (Authentication: NextAuth)

#### CRM Projects
```
GET    /api/crm/projects             # Tüm projeler
POST   /api/crm/projects             # Yeni proje
PUT    /api/crm/projects?id=uuid     # Proje güncelle
DELETE /api/crm/projects?id=uuid     # Proje sil
```

#### CRM Volunteers
```
GET    /api/crm/volunteers           # Tüm gönüllüler
POST   /api/crm/volunteers           # Yeni gönüllü
PUT    /api/crm/volunteers?id=uuid   # Güncelle
DELETE /api/crm/volunteers?id=uuid   # Sil
```

#### Admin Team
```
GET    /api/admin/team               # Takım üyeleri
POST   /api/admin/team               # Yeni üye
PUT    /api/admin/team?id=uuid       # Güncelle
DELETE /api/admin/team?id=uuid       # Sil
```

#### Admin About
```
GET    /api/admin/about              # Hakkımızda içeriği
PUT    /api/admin/about              # İçerik güncelle
```

---

## 🧩 ÖNEMLİ KOMPONENTLER

### 1. HeroSlider.js
**Konum:** `/app/components/HeroSlider.js`

**Amaç:** Homepage'de büyük hero slider gösterir

**Özellikler:**
- API'den slides çeker (`/api/hero-slides`)
- Otomatik geçiş (6 saniye)
- Manuel ok kontrolü
- Dot navigation
- Responsive (mobile + desktop)

**Kullanım:**
```jsx
import HeroSlider from '@/components/HeroSlider';
<HeroSlider />
```

### 2. Navbar.js
**Konum:** `/app/components/Navbar.js`

**Amaç:** Ana navigasyon menüsü

**Özellikler:**
- Sticky positioning (`sticky top-0 z-50`)
- Multi-level dropdown menüler
- Mobile hamburger menü
- Language switcher entegrasyonu
- Active link highlighting

**Önemli Notlar:**
- Desktop'ta dropdown hover ile açılır
- Mobile'da click ile açılır
- Z-index: 50 (en üstte)

### 3. AdminLayout.js
**Konum:** `/app/components/AdminLayout.js`

**Amaç:** Admin panelin layout wrapper'ı

**Özellikler:**
- Sol yan menü (collapsible)
- Top bar (user info, logout)
- Protected route kontrolü
- Menu item'ları dinamik

**Kullanım:**
```jsx
import AdminLayout from '@/components/AdminLayout';

export default function AdminPage() {
  return (
    <AdminLayout>
      <div>Admin içerik</div>
    </AdminLayout>
  );
}
```

### 4. MediaLibraryModal.js
**Konum:** `/app/components/MediaLibraryModal.js`

**Amaç:** Media seçimi için modal

**Özellikler:**
- Tab based (Upload / Media Library / Unsplash)
- Drag & drop upload
- Unsplash search
- Preview ve seçim
- Callback ile URL döndürme

**Kullanım:**
```jsx
const [showModal, setShowModal] = useState(false);
const [selectedImage, setSelectedImage] = useState('');

<MediaLibraryModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSelect={(url) => {
    setSelectedImage(url);
    setShowModal(false);
  }}
/>
```

### 5. ShareButtons.js
**Konum:** `/app/components/ShareButtons.js`

**Amaç:** Social media paylaşım butonları

**Özellikler:**
- Facebook, Twitter, LinkedIn, WhatsApp, Email
- Dropdown variant (küçük buton)
- Copy link özelliği
- Z-index: 200+ (en üstte)

**Kullanım:**
```jsx
import ShareButtons from '@/components/ShareButtons';

<ShareButtons
  url="https://stichtingatlas.nl/nieuws/slug"
  title="Haber Başlığı"
  variant="dropdown"
/>
```

### 6. GoogleMap.js
**Konum:** `/app/components/GoogleMap.js`

**Amaç:** Google Maps entegrasyonu

**Özellikler:**
- Google Maps JS API Loader
- Custom marker
- Configurable lat/lng
- Error handling

**Kullanım:**
```jsx
import GoogleMap from '@/components/GoogleMap';

<GoogleMap
  apiKey={googleMapsKey}
  lat={52.3676}
  lng={4.9041}
  address="Amsterdam, Netherlands"
  height="450px"
/>
```

---

## 🔒 ADMIN PANEL

### Giriş Bilgileri
**URL:** `https://your-domain.com/admin`

**İlk Kullanıcı Oluşturma:**
1. Admin login sayfasına git
2. İlk kullanıcı otomatik admin rolü alır
3. Sonraki kullanıcılar admin panelden yönetilir

### Admin Menü Yapısı
```
Dashboard
├── İstatistikler
├── Hızlı Eylemler
└── Son Aktiviteler

İçerik Yönetimi
├── Homepage
│   ├── Hero Slides
│   └── Featured Sections
├── Nieuws (Haberler)
├── Evenementen (Etkinlikler)
└── Pages
    ├── Over Ons (Hakkımızda)
    └── ANBI

Atlas Academie
├── Cultuur & Educatie
│   ├── Artikelen
│   ├── Video's
│   ├── Cursussen
│   ├── Kalender
│   ├── Rooster
│   ├── Documenten
│   ├── Aankondigingen
│   └── Enquêtes
└── Carrièrecentrum
    ├── Vacatures
    ├── Seminars
    ├── Aankondigingen
    └── Enquêtes

CRM & Proje Yönetimi
├── Projeler (Projects)
├── Gönüllüler (Volunteers)
├── Sponsorlar (Sponsors)
├── Bağışlar (Donations)
└── Başvurular (Applications)

Diğer
├── Contacts (İletişim Mesajları)
├── Surveys (Anketler)
├── Media Library
└── Settings
    ├── SEO Settings
    └── API & Entegrasyonlar
```

### Admin Yetkisi Kontrolü
```javascript
// middleware.js veya component içinde
import { getSession } from 'next-auth/react';

const session = await getSession();
if (!session || session.user.role !== 'admin') {
  redirect('/admin');
}
```

---

## 🔗 ENTEGRASYONLAR

### 1. Stripe (Bağış Sistemi)

**Durum:** ✅ Aktif

**Yapılandırma:**
1. Admin → Settings → API & Entegrasyonlar → Stripe
2. Publishable Key: `pk_test_...` veya `pk_live_...`
3. Secret Key: `sk_test_...` veya `sk_live_...`
4. Mode: Test veya Live

**Test Kartları:**
```
Kart No: 4242 4242 4242 4242
Expiry: 12/34
CVC: 123
```

**Flow:**
```
1. Kullanıcı /doneren sayfasına gider
2. Miktar ve bilgileri girer
3. Frontend /api/stripe-checkout çağırır
4. Stripe Checkout sayfasına yönlendirilir
5. Ödeme tamamlanır
6. /doneren/success sayfasına döner
7. /api/stripe-status ile status kontrol edilir
8. Database'de donations collection'a kaydedilir
```

**Webhook (Opsiyonel):**
```
Webhook URL: https://your-domain.com/api/stripe-webhook
Events: checkout.session.completed, payment_intent.succeeded
```

### 2. Unsplash (Görsel Kütüphanesi)

**Durum:** ✅ Aktif

**Yapılandırma:**
1. Admin → Settings → API & Entegrasyonlar → Unsplash
2. Access Key: `your-unsplash-access-key`
3. Application Name: "Stichting Atlas" (opsiyonel)

**Kullanım:**
- Media Library Modal'da "Unsplash" tab'ı
- Arama yapılabilir
- Seçilen görsel otomatik download edilir (Unsplash analytics için)

**API Endpoint:**
```
GET /api/media/unsplash?query=nature&page=1&per_page=20
POST /api/media/unsplash (import to library)
```

### 3. Google Maps

**Durum:** ✅ Aktif

**Yapılandırma:**
1. Admin → Settings → API & Entegrasyonlar → Google Maps
2. API Key: `AIza...`

**Kullanım:**
- Contact sayfasında harita gösterimi
- GoogleMap component ile

**API Restrictions (Önerilen):**
```
Application restrictions: HTTP referrers
Website restrictions:
  - https://your-domain.com/*
  - http://localhost:3000/* (development)

API restrictions:
  - Maps JavaScript API
```

### 4. Google Drive (Gelecek)

**Durum:** ⏳ Hazırlık Aşaması

**Kullanım Alanları:**
- Doküman storage
- Auto backup
- Team collaboration

### 5. NextAuth.js (Authentication)

**Durum:** ✅ Aktif

**Yapılandırma:**
```javascript
// pages/api/auth/[...nextauth].js
providers: [
  CredentialsProvider({
    // Email + Password
  })
]
```

**Session Kontrolü:**
```javascript
import { getSession } from 'next-auth/react';

const session = await getSession();
if (session) {
  console.log(session.user);
}
```

---

## 🚀 DEPLOYMENT

### Ön Hazırlık

#### 1. Environment Variables Kontrolü
```bash
# .env dosyasında olması gerekenler:
MONGO_URL=mongodb://...              # Emergent otomatik ayarlar
DB_NAME=stichting_atlas              # Emergent otomatik ayarlar
NEXTAUTH_SECRET=random-secret-here   # Güvenli bir string
NEXTAUTH_URL=https://your-domain.com # Production URL
```

#### 2. Dependencies Kontrolü
```bash
# package.json'da tüm dependencies var mı?
yarn install
```

#### 3. Build Test
```bash
# Local build testi
yarn build

# Hata varsa düzelt
```

#### 4. Database Seed Data (Opsiyonel)
```javascript
// İlk admin kullanıcısı oluşturma
// İlk login'de otomatik oluşur, elle oluşturmaya gerek yok
```

### Emergent Platform Deployment

#### Adım 1: Code Ready
```bash
# Tüm değişiklikleri commit et
git add .
git commit -m "Ready for deployment"
```

#### Adım 2: Emergent Dashboard
1. Emergent dashboard'a gir
2. "Deploy" butonuna tıkla
3. Deployment otomatik başlar

#### Adım 3: Otomatik Yapılan İşlemler
```
✅ Code build edilir
✅ Docker image oluşturulur
✅ MongoDB instance oluşturulur (otomatik)
✅ Environment variables ayarlanır (otomatik)
✅ Kubernetes pod'ları deploy edilir
✅ Load balancer konfigürasyonu
✅ SSL certificate (HTTPS)
✅ Domain routing
```

#### Adım 4: Post-Deployment Kontroller
```bash
# 1. Site açılıyor mu?
curl https://your-domain.com

# 2. API çalışıyor mu?
curl https://your-domain.com/api/news

# 3. Admin panel erişilebilir mi?
# Browser'da: https://your-domain.com/admin
```

### Manuel Deployment (VPS)

#### Gereksinimler
```bash
# Ubuntu 20.04+ veya Debian 11+
# Node.js 20.x
# MongoDB 6.x
# Nginx (reverse proxy)
# PM2 veya Supervisor (process manager)
```

#### Adım 1: Server Hazırlık
```bash
# Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Yarn kurulumu
npm install -g yarn

# MongoDB kurulumu
# https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

# PM2 kurulumu
npm install -g pm2
```

#### Adım 2: Code Deploy
```bash
# Projeyi klonla
git clone https://your-repo.git /var/www/stichting-atlas
cd /var/www/stichting-atlas

# Dependencies
yarn install

# .env dosyası oluştur
nano .env
# (Environment variables'ları yapıştır)

# Build
yarn build
```

#### Adım 3: PM2 ile Başlat
```bash
# PM2 ecosystem dosyası
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'stichting-atlas',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/stichting-atlas',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

```bash
# Start
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Adım 4: Nginx Reverse Proxy
```bash
# Nginx config
sudo nano /etc/nginx/sites-available/stichting-atlas
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/stichting-atlas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Adım 5: SSL Certificate (Let's Encrypt)
```bash
# Certbot kurulumu
sudo apt install certbot python3-certbot-nginx

# SSL certificate al
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

### Post-Deployment Checklist

#### Fonksiyonel Testler
- [ ] Homepage yükleniyor
- [ ] Hero slider çalışıyor
- [ ] Navbar dropdown'ları çalışıyor
- [ ] Haberler sayfası çalışıyor
- [ ] Etkinlikler sayfası çalışıyor
- [ ] İletişim formu gönderilebiliyor
- [ ] Bağış sistemi çalışıyor (test mode)
- [ ] Admin panele giriş yapılabiliyor
- [ ] Media Library çalışıyor

#### Güvenlik Kontrolleri
- [ ] HTTPS aktif
- [ ] Admin panel protected
- [ ] API endpoints güvenli
- [ ] Environment variables gizli
- [ ] CORS ayarları doğru

#### Performans Kontrolleri
- [ ] Sayfa yükleme hızı (<3 saniye)
- [ ] Images optimize
- [ ] API response süreleri (<500ms)
- [ ] Database query optimize

---

## 🐛 TROUBLESHOOTING

### Sık Karşılaşılan Sorunlar

#### 1. Site Yüklenmiyor
```bash
# Servis durumu kontrol
sudo supervisorctl status nextjs
# veya
pm2 status

# Log kontrol
tail -f /var/log/supervisor/nextjs.out.log
# veya
pm2 logs stichting-atlas

# Restart
sudo supervisorctl restart nextjs
# veya
pm2 restart stichting-atlas
```

#### 2. MongoDB Bağlantı Hatası
```bash
# MongoDB çalışıyor mu?
sudo systemctl status mongod

# Connection string doğru mu?
echo $MONGO_URL

# MongoDB başlat
sudo systemctl start mongod
```

#### 3. API 500 Hatası
```bash
# Backend logları kontrol
tail -f /var/log/supervisor/nextjs.out.log

# Environment variables kontrol
cat .env

# Restart backend
sudo supervisorctl restart nextjs
```

#### 4. Admin Panele Giriş Yapılamıyor
```bash
# Session secret var mı?
grep NEXTAUTH_SECRET .env

# İlk kullanıcı oluştur (MongoDB shell)
mongo stichting_atlas
db.users.insertOne({
  id: "uuid-here",
  email: "admin@stichtingatlas.com",
  password: "$2a$10$hashedpassword",
  name: "Admin",
  role: "admin"
});
```

#### 5. Stripe Test Ödemeleri Çalışmıyor
```bash
# Stripe keys kontrol
# Admin → Settings → API & Entegrasyonlar → Stripe

# Test mode seçili mi?
# Mode: "test"

# Test kartı doğru mu?
# 4242 4242 4242 4242
```

#### 6. Images Yüklenmiyor
```bash
# Uploads klasörü var mı?
ls -la /app/public/uploads

# Yazma izni var mı?
sudo chmod 755 /app/public/uploads

# Unsplash key var mı?
# Admin → Settings → Unsplash
```

#### 7. React Hydration Error
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
yarn build

# Restart
sudo supervisorctl restart nextjs
```

#### 8. Object Render Error
```
Error: Objects are not valid as a React child
```
**Çözüm:**
- Component'te obje direkt render ediliyordur
- `{object}` yerine `{object.property}` kullan
- Veya `{JSON.stringify(object)}` ile debug et

---

## 📞 DESTEK

### Dokümantasyon
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- MongoDB: https://www.mongodb.com/docs
- Stripe: https://stripe.com/docs

### Önemli Dosyalar
- `/app/README.md` - Bu dosya
- `/app/package.json` - Dependencies
- `/app/.env.example` - Environment variables örneği
- `/app/DEPLOYMENT_GUIDE_TR.md` - Deployment detayları

### Kod Yapısı
- **Clean Architecture**: Component-based, modular
- **Convention**: Camel case for variables, Pascal case for components
- **Styling**: Tailwind CSS utility-first
- **State Management**: React Hooks (no Redux)
- **API**: RESTful, JSON responses

---

## ✅ DEPLOYMENT CHECKLİST

### Deployment Öncesi
- [ ] Tüm testler geçti
- [ ] `.env` dosyası hazır
- [ ] `yarn build` çalışıyor
- [ ] Dependencies güncel
- [ ] Database seed data hazır (opsiyonel)
- [ ] API keys alındı (Stripe, Unsplash, vb.)

### Deployment Sırasında
- [ ] Code deploy edildi
- [ ] Environment variables ayarlandı
- [ ] Database bağlantısı çalışıyor
- [ ] SSL certificate kuruldu
- [ ] Domain routing yapıldı

### Deployment Sonrası
- [ ] Homepage açılıyor
- [ ] Admin panel erişilebilir
- [ ] İlk admin kullanıcısı oluşturuldu
- [ ] API entegrasyonları test edildi
- [ ] Settings sayfasından API keys girildi
- [ ] Test bağışı yapıldı
- [ ] İletişim formu test edildi
- [ ] Media Library test edildi

---

## 🎯 SONUÇ

Bu dokümantasyon, Stichting Atlas web uygulamasının tüm teknik detaylarını içermektedir. Deployment için gerekli tüm bilgiler yukarıda detaylı şekilde anlatılmıştır.

**Başarılı bir deployment için:**
1. Environment variables'ları doğru ayarlayın
2. MongoDB bağlantısını test edin
3. Emergent platform'u kullanarak deploy edin (önerilen)
4. Post-deployment testleri yapın
5. Admin panelden ilk konfigürasyonu tamamlayın

**Sorularınız için:**
- Dokümantasyonu dikkatlice okuyun
- Troubleshooting bölümüne bakın
- Log dosyalarını kontrol edin

**Başarılar! 🚀**

---

*Son Güncelleme: 26 Ekim 2024*
*Versiyon: 1.0*
*Hazırlayan: AI Development Team*
