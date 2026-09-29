/**
 * image-processor.js
 * İstemci tarafında görselleri Canvas ile 1080p (maks. 1920x1080) boyutuna optimize eder
 * ve WebP (veya kaliteli JPEG) formatına dönüştürür.
 */

const ImageProcessor = {
  /**
   * Bir görsel dosyasını alır, en-boy oranını koruyarak maksimum 1920x1080 sınırına ölçekler
   * ve optimize edilmiş DataURL (WebP/JPEG) olarak döndürür.
   * @param {File|Blob} file 
   * @param {number} maxDimension - Varsayılan: 1920 (1080p)
   * @param {number} quality - Varsayılan: 0.85
   * @returns {Promise<{dataUrl: string, width: number, height: number, sizeKB: number}>}
   */
  async processImage(file, maxDimension = 1920, quality = 0.85) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('Geçersiz görsel dosyası.'));
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;

          // En-boy oranını koruyarak 1920 sınırına indir
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          // Canvas oluştur ve çiz
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          // Yüksek kaliteli küçültme için yumuşatma
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, 0, 0, width, height);

          // WebP desteğini dene, yoksa JPEG'e dön
          let dataUrl = '';
          try {
            dataUrl = canvas.toDataURL('image/webp', quality);
            if (!dataUrl.startsWith('data:image/webp')) {
              dataUrl = canvas.toDataURL('image/jpeg', quality);
            }
          } catch (err) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          // Tahmini boyut hesapla (Base64 string uzunluğundan)
          const sizeKB = Math.round((dataUrl.length * 3 / 4) / 1024);

          resolve({
            dataUrl,
            width,
            height,
            sizeKB
          });
        };

        img.onerror = () => reject(new Error('Görsel yüklenirken hata oluştu.'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Dosya okunamadı.'));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Birden fazla dosyayı sırayla veya paralel optimize eder.
   */
  async processMultiple(files, maxCount = 4) {
    const fileList = Array.from(files).slice(0, maxCount);
    const promises = fileList.map(file => this.processImage(file));
    return Promise.all(promises);
  }
};

window.ImageProcessor = ImageProcessor;
