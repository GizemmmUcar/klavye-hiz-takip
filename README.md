# ⌨️ Klavye Hız Takip Sistemi

> Klavye yazma hızınızı takip edin, analiz edin ve geliştirin.

**🌐 Canlı Demo:** [klavye-hiz-takip.vercel.app](https://klavye-hiz-takip.vercel.app)

---

## 📸 Ekran Görüntüleri

> *(Görseller eklenecek — aşağıdaki adımları takip edin)*

---

## 🚀 Proje Hakkında

**Klavye Hız Takip**, WPM (dakikada kelime) testlerinizi kayıt altına almanızı, geçmişinizi görüntülemenizi ve performansınızı grafiklerle analiz etmenizi sağlayan bir web uygulamasıdır.

Öğrenciler, yazılımcılar ve hız yazma meraklıları için tasarlanmıştır.

---

## ✨ Özellikler

- 📝 **Veri Girişi** — WPM, hata sayısı, yorgunluk seviyesi, klavye türü ve ortam bilgisi kayıt
- 📋 **Geçmiş** — Tüm test kayıtlarını listeleme, filtreleme ve silme
- 📊 **Analiz Paneli** — 4 farklı grafik ile performans analizi:
  - WPM değişim çizgi grafiği
  - Yorgunluk–hata ilişkisi
  - Klavye türüne göre karşılaştırma
  - Ortama göre performans
- 💡 **Otomatik İçgörüler** — Verilerinize göre öneriler ve tespitler
- 💾 **Yerel Depolama** — Veriler tarayıcıda saklanır, sunucu gerekmez
- 📱 **Responsive Tasarım** — Mobil ve masaüstü uyumlu

---

## 🛠️ Kullanılan Teknolojiler

| Teknoloji | Açıklama |
|---|---|
| HTML5 | Sayfa yapısı |
| CSS3 | Özel animasyonlar ve dark theme |
| JavaScript (Vanilla) | Uygulama mantığı, localStorage |
| Bootstrap 5 | UI bileşenleri ve grid sistemi |
| Chart.js | Grafikler ve veri görselleştirme |
| Bootstrap Icons | İkonlar |
| Google Fonts | JetBrains Mono, Space Grotesk |

---

## 📁 Dosya Yapısı

```
klavye-hiz-takip/
├── index.html        # Veri girişi sayfası
├── history.html      # Test geçmişi sayfası
├── dashboard.html    # Analiz ve grafikler
├── style.css         # Tüm stiller
└── app.js            # Uygulama mantığı
```

---

## ⚙️ Kurulum & Çalıştırma

Bu proje saf HTML/CSS/JS ile yazılmıştır. Kurulum gerekmez.

### Yerel Çalıştırma

```bash
# Repoyu klonla
git clone https://github.com/GizemmmUcar/klavye-hiz-takip.git

# Klasöre gir
cd klavye-hiz-takip

# index.html dosyasını tarayıcıda aç
# veya bir local server başlat:
npx serve .
```

Tarayıcınızda `http://localhost:3000` adresine gidin.

---

## 📊 Veri Türleri

Uygulama üç farklı veri türü kullanır:

| Tür | Örnekler |
|---|---|
| **Nicel Veri** | WPM, hata sayısı |
| **Nitel Veri** | Yorgunluk seviyesi (1–5) |
| **Bağlamsal Veri** | Klavye türü, ortam |

---

## 📸 README'ye Görsel Ekleme

Projeye ekran görüntüsü eklemek için:

1. Uygulamayı tarayıcıda açın
2. Her sayfanın ekran görüntüsünü alın (`screenshots/` klasörüne kaydedin)
3. Dosyaları repoya ekleyin:
   ```bash
   git add screenshots/
   git commit -m "docs: ekran görüntüleri eklendi"
   git push
   ```
4. Bu README'deki `Ekran Görüntüleri` bölümünü güncelleyin:
   ```markdown
   ![Veri Girişi](screenshots/index.png)
   ![Analiz](screenshots/dashboard.png)
   ```

---

## 🤝 Katkıda Bulunma

1. Bu repoyu fork'layın
2. Yeni bir branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: yeni özellik'`)
4. Branch'i push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.

---

<p align="center">
  ⌨️ <strong>Klavye Hız Takip Sistemi</strong> — 2026
</p>
