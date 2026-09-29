/**
 * collage.js
 * 1 ila 4 fotoğraf için dinamik ve estetik kolaj şablonlarını oluşturan modül.
 */

const CollageBuilder = {
  /**
   * Fotoğraf listesini alır ve uygun CSS Grid şablonu ile HTML döndürür.
   * @param {Array<string>} photos - Görsel URL veya DataURL listesi (1 - 4 adet)
   * @param {string} theme - Seçili tema
   * @param {string} orientation - 'landscape' veya 'portrait'
   * @returns {string} HTML içeriği
   */
  render(photos = [], theme = 'minimalist', orientation = 'landscape') {
    if (!photos || photos.length === 0) {
      return `
        <div class="empty-collage">
          <div class="empty-icon">📷</div>
          <p>Henüz fotoğraf eklenmedi.</p>
        </div>
      `;
    }

    const count = Math.min(photos.length, 4);
    const validPhotos = photos.slice(0, count);

    let itemsHtml = '';
    validPhotos.forEach((src, index) => {
      itemsHtml += `
        <div class="photo-cell cell-${index + 1}">
          <div class="photo-frame">
            <img src="${src}" alt="Anı Fotoğrafı ${index + 1}" loading="lazy" />
          </div>
        </div>
      `;
    });

    return `
      <div class="collage-container collage-count-${count} orientation-${orientation}">
        ${itemsHtml}
      </div>
    `;
  }
};

window.CollageBuilder = CollageBuilder;
