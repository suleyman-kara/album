# FotoAlbüm Studio

Kişisel anılarınızı ve fotoğraflarınızı önceden tasarlanmış estetik temalarla A4 formatında profesyonel dijital albümlere dönüştüren ve tek tıkla PDF olarak dışa aktaran hafif, modern ve gizlilik odaklı statik web uygulaması.

---

## Öne Çıkan Özellikler

- **🎨 4 Özgün Tasarım Teması:** Klasik Minimalist, Vintage Parşömen (Polaroid çerçeveli), Romantik Pastel ve Gece Galerisi (Dark Art Gallery).
- **📑 2 Esnek Sayfa Düzeni (Mizanpaj):**
  - *Tek Sayfa (Bölünmüş):* Her anı tek bir A4 sayfasında; yarısı başlık ve hikaye metni, diğer yarısı otomatik fotoğraf kolajı.
  - *İki Sayfa (Geniş):* Klasik kitap/dergi açılışı; sol sayfa tam metin, sağ sayfa tam sayfa kolaj.
- **🖼️ Akıllı Kolaj Motoru:** Olay başına 1 ila 4 fotoğraf kabul eder; en-boy oranlarını koruyarak fotoğrafları dengeli bir ızgarada otomatik birleştirir.
- **⚡ İstemci Taraflı 1080p Optimizasyon:** Yüklenen yüksek çözünürlüklü fotoğraflar tarayıcı içinde Canvas API ile otomatik olarak 1080p WebP formatına küçültülür. Sunucuya hiçbir fotoğraf gönderilmez, gizliliğiniz tamamen korunur.
- **📥 Kusursuz PDF ve Baskı Motoru:**
  - *Doğrudan İndirme:* Sayfa sayfa (page-by-page) retina netliğinde, boş sayfasız PDF indirme.
  - *Vektörel Baskı:* Tarayıcının yerel baskı arayüzü ile 300 DPI kalitesinde doğrudan yazdırma veya PDF olarak kaydetme.
- **💾 Otomatik Taslak Kaydı:** Tarayıcının `localStorage` hafızası ile taslaklarınız kaybolmaz.

---

## Canlı Demo & Yayın

GitHub Pages üzerinden hemen kullanabilirsiniz:  
👉 **[https://suleyman-kara.github.io/album/](https://suleyman-kara.github.io/album/)**

---

## Yerel Kurulum & Çalıştırma

Proje hiçbir derleme veya harici bağımlılık gerektirmez:

1. **Doğrudan Açma:**  
   `docs/index.html` dosyasını tarayıcınızda çift tıklayarak hemen açabilirsiniz.

2. **Yerel Sunucu ile:**
   ```bash
   python -m http.server -d docs 8000
   ```
   Tarayıcınızdan `http://localhost:8000` adresine gidin.

---

## Lisans

Bu proje [MIT Lisansı](LICENSE) ile korunmaktadır.
