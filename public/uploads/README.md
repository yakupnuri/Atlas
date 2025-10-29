# 📁 Uploads Klasörü

Bu klasör kullanıcıların yüklediği resimleri saklar.

## ⚠️ ÖNEMLİ NOTLAR:

### Deployment İçin:
1. Bu klasör deployment sırasında **korunmalıdır** (persistent volume)
2. Boş olsa bile Git'e dahil edilmelidir (.gitkeep sayesinde)

### Kullanım:
- Resimler buraya yüklenir: `/public/uploads/`
- URL'den erişim: `https://site.com/uploads/dosya-adi.jpg`

### Yedekleme:
```bash
# Yedekleme
tar -czf uploads-backup.tar.gz /app/public/uploads/

# Geri Yükleme
tar -xzf uploads-backup.tar.gz -C /
```

### İzinler:
```bash
chmod -R 755 /app/public/uploads/
chown -R www-data:www-data /app/public/uploads/
```

## 🚨 SORUN GİDERME:

### 404 Hatası Alıyorsanız:
1. Dosyanın gerçekten bu klasörde olduğunu kontrol edin
2. Dosya izinlerini kontrol edin
3. Next.js'in public klasörünü serve ettiğinden emin olun
4. Deployment'ta persistent volume aktif mi kontrol edin

### Resimler Kayboluyorsa:
- Container yeniden başladığında resimlerin kaybolması normaldir
- Çözüm: Persistent volume kullanın veya harici storage (Cloudinary, S3)
