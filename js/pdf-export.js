/**
 * pdf-export.js
 * html2pdf.js ile tek tıkla doğrudan PDF indirme ve window.print() ile
 * 300 DPI vektörel baskı almayı sağlayan modül.
 */

const PDFExporter = {
  /**
   * Albümü PDF olarak oluşturup indirir.
   * @param {HTMLElement} element - Dışa aktarılacak albüm konteyneri
   * @param {string} orientation - 'landscape' veya 'portrait'
   * @param {string} filename - İndirilecek dosya adı
   * @param {function} onProgress - Durum güncelleme geri çağırımı
   */
  async downloadPDF(element, orientation = 'landscape', filename = 'fotograf-albumum.pdf', onProgress = null) {
    if (typeof html2pdf === 'undefined') {
      alert('PDF oluşturucu kütüphanesi yüklenemedi. Alternatif olarak "Yazdır / PDF Kaydet" butonunu kullanabilirsiniz.');
      return;
    }

    if (onProgress) onProgress('PDF hazırlanıyor, sayfalar taranıyor...');

    // html2pdf seçenekleri
    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.96 },
      html2canvas: {
        scale: 2, // 2x retina netliği
        useCORS: true, // Harici Unsplash / CDN görselleri için CORS
        allowTaint: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: orientation,
        compress: true
      },
      pagebreak: {
        mode: ['css', 'legacy'],
        before: '.album-page:not(:first-child)'
      }
    };

    const oldTransform = element.style.transform;
    element.style.transform = 'none';

    try {
      if (onProgress) onProgress('Sayfalar işleniyor, lütfen bekleyin...');
      await html2pdf().set(opt).from(element).save();
      if (onProgress) onProgress('PDF başarıyla indirildi!');
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('PDF oluşturulurken bir hata meydana geldi. Doğrudan "Yazdır / PDF Kaydet" seçeneğini kullanabilirsiniz.');
      if (onProgress) onProgress('Hata oluştu.');
    } finally {
      element.style.transform = oldTransform;
    }
  },

  /**
   * Tarayıcının yerel yazdırma penceresini açar (vektörel ve sıfır kayıpsız çıktı).
   */
  printAlbum() {
    window.print();
  }
};

window.PDFExporter = PDFExporter;
