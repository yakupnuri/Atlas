# 🚀 STICHTING ATLAS - DEPLOYMENT REHBERİ

## 1️⃣ DEPLOYMENT ADIMLARI (Emergent Platform)

### Adım 1: Kod Hazır mı Kontrol Edin
✅ **Tamamlandı!** Kodunuz deployment için hazır.
- Hardcoded database isimleri temizlendi
- Environment variables doğru kullanılıyor
- Tüm testler geçti

### Adım 2: Emergent Dashboard'a Gidin
1. https://emergentagent.com adresine gidin
2. Sol menüden **"Deploy"** butonuna tıklayın
3. Veya chat input'un yanındaki **"Deploy"** butonunu kullanın

### Adım 3: Deployment Başlat
1. Deploy butonuna tıkladığınızda otomatik deployment başlar
2. Sistem şunları yapar:
   - ✅ Kodu build eder
   - ✅ MongoDB instance oluşturur (otomatik!)
   - ✅ Environment variables ayarlar
   - ✅ Production URL oluşturur

### Adım 4: Deployment Tamamlanınca
- Size bir **production URL** verilecek: `https://your-app.emergent.com`
- Bu URL ile sitenize erişebilirsiniz
- MongoDB otomatik bağlanmış olacak

### Adım 5: İlk Admin Kullanıcısı Oluşturun
1. Production URL'e gidin: `https://your-app.emergent.com/admin/login`
2. İlk admin kullanıcınızı oluşturun
3. Giriş yapın ve ayarları yapılandırın

---

## 2️⃣ MONGODB OTOMATIK BAĞLANMA

### ✅ EVET, Otomatik Bağlanır!

Emergent deployment yaparken:
1. **Otomatik MongoDB Instance Oluşturur**
   - Her app için ayrı MongoDB database
   - Hiçbir şey yapmanıza gerek yok!

2. **Otomatik Environment Variables Ayarlar**
   ```
   MONGO_URL=mongodb://... (Emergent tarafından otomatik set edilir)
   DB_NAME=your_app_db (Emergent tarafından otomatik set edilir)
   ```

3. **Kodunuz Zaten Hazır**
   - Tüm API route'lar `process.env.DB_NAME` kullanıyor ✅
   - MongoDB connection `process.env.MONGO_URL` kullanıyor ✅

### Veritabanı İlk Durum
Deployment sonrası veritabanı **BOŞ** olacak. İlk datalar otomatik oluşturulacak:
- İlk admin kullanıcısı (sizin oluşturacağınız)
- Default homepage settings
- Boş collections (news, events, vb.)

---

## 3️⃣ VERİTABANI YAPISI

### Collections (Tablolar)

#### 1. **users** - Kullanıcılar
```javascript
{
  id: "uuid",
  email: "admin@stichtingatlas.com",
  password: "hashed",
  name: "Admin",
  role: "admin",
  createdAt: "2025-01-27T..."
}
```

#### 2. **news** - Haberler
```javascript
{
  id: "uuid",
  title: "Haber Başlığı",
  slug: "haber-basligi",
  excerpt: "Kısa açıklama",
  content: "HTML içerik",
  author: "Yazar",
  category: "Etkinlik|Eğitim|Duyuru",
  image: "https://...",
  featured: true/false,
  publishDate: "2025-01-27T...",
  createdAt: "2025-01-27T..."
}
```

#### 3. **events** - Etkinlikler
```javascript
{
  id: "uuid",
  title: "Etkinlik Adı",
  slug: "etkinlik-adi",
  description: "Açıklama",
  category: "soepdag|educatie|festival|vrouwen-gezin",
  startAt: "2025-02-15T19:00:00Z",
  endAt: "2025-02-15T22:00:00Z",
  locationName: "Atlas Centrum",
  capacity: 50,
  bannerImage: "https://...",
  isPaid: false,
  price: 0,
  createdAt: "2025-01-27T..."
}
```

#### 4. **homepage_content** - Ana Sayfa Ayarları
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
      mode: "test|live"
    },
    unsplash: {
      accessKey: "...",
      applicationName: "..."
    },
    googleMaps: {
      apiKey: "AIza..."
    },
    googleDrive: {
      clientId: "...",
      clientSecret: "...",
      enabled: true/false
    }
  },
  featuredSections: {...},
  createdAt: "2025-01-27T..."
}
```

#### 5. **surveys** - Anketler
```javascript
{
  id: "uuid",
  title: "Anket Başlığı",
  module: "career|education|projects",
  questions: [...],
  endDate: "2025-03-01T...",
  isActive: true,
  responses: 15,
  createdAt: "2025-01-27T..."
}
```

#### 6. **anbi_documents** - ANBI Dökümanları
```javascript
{
  id: "uuid",
  type: "beleidsplan|beloningsbeleid|jaarrekening",
  fileName: "document.pdf",
  filePath: "/uploads/anbi/...",
  uploadDate: "2025-01-27T..."
}
```

#### 7. Diğer Collections
- `reservations` - Etkinlik rezervasyonları
- `contacts` - İletişim form mesajları
- `crm_projects` - CRM projeleri
- `crm_volunteers` - Gönüllüler
- `education_content` - Eğitim merkezi içerikleri
- `career_content` - Kariyer merkezi içerikleri

---

## 4️⃣ API ENTEGRASYONLARI - OTOMATIK BAĞLANMA

### ⚠️ ŞU AN: Sadece Kayıt Ediliyor

**Mevcut durum:**
- Settings sayfasından API anahtarlarını kaydedebilirsiniz ✅
- Anahtarlar MongoDB'de saklanır ✅
- **ANCAK**: Henüz otomatik kullanılmıyor ❌

### 🔧 Entegrasyonların Aktif Olması İçin Gerekli

#### **1. Stripe (Doneren/Bağış Sayfası)**
**Şu an:** Sayfa placeholder (yer tutucu)
**Gerekli:** 
- Stripe SDK entegrasyonu
- Ödeme formu implementasyonu
- Webhook kurulumu

**Yapılması gerekenler:**
```javascript
// /app/doneren/page.js içinde
// Stripe SDK kullanımı eklenecek
import { loadStripe } from '@stripe/stripe-js';
// API'den publishableKey çekilip kullanılacak
```

#### **2. Unsplash (Media Library)**
**Şu an:** Hardcoded API key ile çalışıyor
**Gerekli:**
- Settings'ten kaydedilen key'i kullanması

**Yapılması gerekenler:**
```javascript
// /components/MediaLibraryModal.js içinde
// Hardcoded key yerine API'den çekilecek:
// const unsplashKey = await getIntegrationKey('unsplash');
```

#### **3. Google Maps**
**Şu an:** Kullanılmıyor
**Gerekli:**
- Contact sayfasına harita eklenmesi
- Event location map gösterimi

#### **4. Google Drive**
**Şu an:** Kullanılmıyor
**Gerekli:**
- Document upload/storage sistemi
- OAuth implementasyonu

---

## 5️⃣ API ENTEGRASYONLARINI AKTİF HALE GETİRME

### Seçenek 1: Manuel Entegrasyon (Önerilen)
Her entegrasyon için ayrı ayrı implement edilmesi gerekiyor.

**Öncelik sırası:**
1. **Stripe** (Bağış sistemi) - En önemli
2. **Unsplash** (Media Library) - Kolay
3. **Google Maps** (Haritalar) - Orta
4. **Google Drive** (Document storage) - Gelecek

### Seçenek 2: Şimdilik Manuel Key Kullanımı
Deployment sonrası:
1. Environment variables olarak manuel ekleyin:
   ```
   STRIPE_PUBLISHABLE_KEY=pk_...
   STRIPE_SECRET_KEY=sk_...
   UNSPLASH_ACCESS_KEY=...
   GOOGLE_MAPS_KEY=AIza...
   ```
2. Kod içinde `process.env.STRIPE_PUBLISHABLE_KEY` şeklinde kullanın

---

## 6️⃣ DEPLOYMENT SONRASI KONTROL LİSTESİ

### ✅ Hemen Yapılması Gerekenler

1. **Admin Kullanıcısı Oluştur**
   - `/admin/login` adresine git
   - İlk admin hesabını oluştur

2. **Temel Ayarları Yap**
   - Settings → SEO ayarları
   - Settings → API keys (eğer kullanacaksanız)

3. **İlk İçerikleri Ekle**
   - Admin → Nieuws → 5-10 haber ekle
   - Admin → Evenementen → Yaklaşan etkinlikler ekle
   - Admin → Over Ons → Team bilgilerini ekle

4. **Test Et**
   - Ana sayfayı kontrol et
   - Tüm public sayfaları gez
   - Form gönderimlerini test et
   - Mobile görünümü kontrol et

5. **Domain Bağla (Opsiyonel)**
   - Emergent dashboard'tan custom domain ekle
   - DNS ayarlarını yap

---

## 7️⃣ ÖZET - DEPLOYMENT SÜRECİ

```
1. Deploy Butonuna Tıkla
   ↓
2. Emergent Otomatik Yapar:
   - Build
   - MongoDB oluştur
   - Environment variables ayarla
   - Production URL ver
   ↓
3. Sen Yaparsın:
   - İlk admin oluştur
   - İçerikleri ekle
   - Settings'i ayarla
   ↓
4. SİTE YAYINDA! 🎉
```

---

## ❓ SORULAR & CEVAPLAR

### S1: MongoDB'de veri kaybolur mu?
**C:** Hayır! Emergent deployment sonrası MongoDB persistent (kalıcı) olur. Verileriniz güvende.

### S2: API keys database'de güvenli mi?
**C:** MongoDB güvenli ama best practice için:
- Production'da Environment Variables kullanın
- Hassas key'leri encrypt edin (gelecek özellik)

### S3: Deployment sonrası kod güncellemesi nasıl?
**C:** Emergent chat'ten "Deploy et" dediğinizde otomatik güncellenir.

### S4: Stripe test mode'dan live mode'a nasıl geçerim?
**C:** 
1. Settings → API & Entegrasyonlar
2. Stripe → Live Mode seç
3. Live keys gir
4. Kaydet

### S5: Yerel datayı production'a taşıyabilir miyim?
**C:** Evet! MongoDB export/import yapabilirsiniz (ayrı guide gerekli).

---

## 🎯 ÖNEMLİ NOTLAR

1. **İlk deployment BOŞ veritabanı ile başlar**
   - Manuel içerik eklemeniz gerekir
   - Veya seed data scripti yazabilirsiniz

2. **API entegrasyonları henüz otomatik bağlanmıyor**
   - Settings'e kayıt edebilirsiniz
   - Ama kullanılması için kod güncellemesi gerekir
   - Faz 2'de implement edilecek

3. **Production hazır ama içerik yok**
   - Homepage gösterilecek ama haberler/etkinlikler olmayacak
   - İlk 10-15 içeriği manuel ekleyin

4. **Email sistemi demo mode**
   - Console'a yazıyor, gerçek email gitmiyor
   - SMTP ayarları için environment variables gerekli

---

**DEPLOYMENT İÇİN HAZIRSINIZ! 🚀**

Sorularınız varsa sormaktan çekinmeyin!
