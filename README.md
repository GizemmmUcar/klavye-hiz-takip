# Klavye Hız Takip Sistemi

> Klavye yazma hızınızı takip edin, analiz edin ve geliştirin.

**Canlı Demo:** [klavye-hiz-takip.vercel.app](https://klavye-hiz-takip.vercel.app)

---



## Proje Hakkında

**Klavye Hız Takip**, WPM (dakikada kelime) testlerinizi kayıt altına almanızı, geçmişinizi görüntülemenizi ve performansınızı grafiklerle analiz etmenizi sağlayan bir web uygulamasıdır.

Öğrenciler, yazılımcılar ve hız yazma meraklıları için tasarlanmıştır.

---
## Ekran Görüntüleri


<img width="902" height="855" alt="Ekran görüntüsü 2026-03-31 101332" src="https://github.com/user-attachments/assets/3d4f3cde-cd60-4539-9d61-d9cc1af75135" />
<img width="915" height="846" alt="Ekran görüntüsü 2026-03-31 101342" src="https://github.com/user-attachments/assets/5128324b-3748-4544-b2a5-caf6519b3edd" />
<img width="921" height="851" alt="Ekran görüntüsü 2026-03-31 101351" src="https://github.com/user-attachments/assets/3ada1e16-b3d3-4f2d-a4c2-045240ce38da" />

---

## Özellikler

- **Veri Girişi** — WPM, hata sayısı, yorgunluk seviyesi, klavye türü ve ortam bilgisi kayıt
- **Geçmiş** — Tüm test kayıtlarını listeleme, filtreleme ve silme
- **Analiz Paneli** — 4 farklı grafik ile performans analizi:
  - WPM değişim çizgi grafiği
  - Yorgunluk–hata ilişkisi
  - Klavye türüne göre karşılaştırma
  - Ortama göre performans
- **Otomatik İçgörüler** — Verilerinize göre öneriler ve tespitler
- **Yerel Depolama** — Veriler tarayıcıda saklanır, sunucu gerekmez
- **Responsive Tasarım** — Mobil ve masaüstü uyumlu

---

## Kullanılan Teknolojiler

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

## Dosya Yapısı

```
klavye-hiz-takip/
├── index.html        # Veri girişi sayfası
├── history.html      # Test geçmişi sayfası
├── dashboard.html    # Analiz ve grafikler
├── style.css         # Tüm stiller
└── app.js            # Uygulama mantığı
```

---

## Kurulum & Çalıştırma

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

## Veri Türleri

Uygulama üç farklı veri türü kullanır:

| Tür | Örnekler |
|---|---|
| **Nicel Veri** | WPM, hata sayısı |
| **Nitel Veri** | Yorgunluk seviyesi (1–5) |
| **Bağlamsal Veri** | Klavye türü, ortam |

---




---

<p align="center">
  ⌨️ <strong>Klavye Hız Takip Sistemi</strong> — 2026
</p>
