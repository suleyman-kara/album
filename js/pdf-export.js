/**
 * pdf-export.js
 * Sayfa sayfa (Page-by-Page) garantili ve taşmasız PDF indirme ile
 * window.print() 300 DPI vektörel baskı modülü.
 */

const PDFExporter = {
  /**
   * Albüm sayfalarını tek tek işleyerek sıfır boş sayfa garantisiyle PDF oluşturur.
   * @param {HTMLElement} element - Dışa aktarılacak albüm konteyneri
   * @param {string} orientation - 'landscape' veya 'portrait'
   * @param {string} filename - İndirilecek dosya adı
   * @param {function} onProgress - Durum güncelleme geri çağırımı
   */
  async downloadPDF(element, orientation = 'landscape', filename = 'fotograf-albumum.pdf', onProgress = null) {
    const pages = element.querySelectorAll('.album-page');
    if (!pages || pages.length === 0) {
      alert('Dışa aktarılacak sayfa bulunamadı.');
      return;
    }

    if (typeof html2canvas === 'undefined') {
      alert('Görsel işleme kütüphanesi yüklenemedi. Alternatif olarak "Yazdır / PDF Kaydet" butonunu kullanabilirsiniz.');
      return;
    }

    const jsPDFConstructor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!jsPDFConstructor) {
      alert('PDF oluşturucu kütüphanesi yüklenemedi. Alternatif olarak "Yazdır / PDF Kaydet" butonunu kullanabilirsiniz.');
      return;
    }

    const totalPages = pages.length;
    if (onProgress) onProgress(`PDF hazırlanıyor... (Toplam ${totalPages} sayfa)`);

    const pdf = new jsPDFConstructor({
      orientation: orientation,
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = orientation === 'landscape' ? 297 : 210;
    const pageHeight = orientation === 'landscape' ? 210 : 297;

    // Zoom transformunu geçici olarak kaldır
    const oldTransform = element.style.transform;
    element.style.transform = 'none';

    try {
      for (let i = 0; i < totalPages; i++) {
        const pageEl = pages[i];
        if (onProgress) onProgress(`Sayfa ${i + 1} / ${totalPages} işleniyor...`);

        const canvas = await html2canvas(pageEl, {
          scale: 2, // 2x retina netliği
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: null
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) {
          pdf.addPage('a4', orientation);
        }

        // Sayfa sınırlarına piksel taşmasız tam yerleştir
        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
      }

      if (onProgress) onProgress('PDF dosyası oluşturuluyor...');
      pdf.save(filename);
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
