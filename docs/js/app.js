/**
 * app.js
 * FotoAlbüm Studio - Ana Durum (State) Yönetimi ve Etkileşim Motoru
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. DURUM (STATE) TANIMI
  // ==========================================================================
  const state = {
    orientation: 'landscape', // 'landscape' | 'portrait'
    layoutMode: 'split',      // 'split' (tek sayfa bölünmüş) | 'spread' (iki sayfa geniş)
    theme: 'vintage',        // 'minimalist' | 'vintage' | 'romantic' | 'dark'
    zoom: 0.75,              // Önizleme yakınlaştırma oranı
    mobileTab: 'edit',       // 'edit' | 'preview'
    cover: {
      title: 'Ege & Akdeniz Yolculuğu',
      subtitle: 'Masmavi Koylar, Tarihi Sokaklar ve Unutulmaz Anlar',
      date: 'Ağustos 2024',
      photo: ''
    },
    backCover: {
      quote: '“Her yolculuk yeni bir başlangıç, her anı ömür boyu saklanacak bir hazinedir.”',
      author: 'Bir Yol Hikayesi • 2024'
    },
    events: [],
    // Düzenleme / form anlık durumları
    editingEventId: null,
    currentFormPhotos: [] // Eklenmekte olan olayın optimize edilmiş fotoğrafları (Maks. 4)
  };

  // ==========================================================================
  // 2. DOM ELEMANLARI
  // ==========================================================================
  const el = {
    // Sayfa Yönü, Düzeni & Tema
    orientationBtns: document.querySelectorAll('[data-orientation]'),
    layoutBtns: document.querySelectorAll('[data-layout]'),
    themeCards: document.querySelectorAll('[data-theme]'),
    albumContainer: document.getElementById('album-container'),
    albumViewport: document.getElementById('album-viewport'),
    dynamicPrintStyle: document.getElementById('dynamic-print-style'),
    
    // Kapak
    coverTitleInput: document.getElementById('cover-title-input'),
    coverSubtitleInput: document.getElementById('cover-subtitle-input'),
    coverDateInput: document.getElementById('cover-date-input'),
    coverDropzone: document.getElementById('cover-dropzone'),
    coverFileInput: document.getElementById('cover-file-input'),
    coverThumbPreview: document.getElementById('cover-thumb-preview'),

    // Olay Formu
    formHeading: document.getElementById('form-event-heading'),
    editingEventIdInput: document.getElementById('editing-event-id'),
    btnCancelEdit: document.getElementById('btn-cancel-edit'),
    eventTitleInput: document.getElementById('event-title-input'),
    eventLocationInput: document.getElementById('event-location-input'),
    eventParagraphInput: document.getElementById('event-paragraph-input'),
    charCounter: document.getElementById('char-counter'),
    photoCountBadge: document.getElementById('photo-count-badge'),
    eventDropzone: document.getElementById('event-dropzone'),
    eventFilesInput: document.getElementById('event-files-input'),
    eventThumbsPreview: document.getElementById('event-thumbs-preview'),
    btnSaveEvent: document.getElementById('btn-save-event'),

    // Olay Listesi
    eventsListContainer: document.getElementById('events-list-container'),
    eventCountBadge: document.getElementById('event-count'),

    // Arka Kapak
    backQuoteInput: document.getElementById('back-quote-input'),
    backAuthorInput: document.getElementById('back-author-input'),

    // Üst Araçlar & Aksiyonlar
    btnLoadSample: document.getElementById('btn-load-sample'),
    btnPrint: document.getElementById('btn-print'),
    btnDownloadPdf: document.getElementById('btn-download-pdf'),
    btnResetAlbum: document.getElementById('btn-reset-album'),
    btnLoadSampleSidebar: document.getElementById('btn-load-sample-sidebar'),

    // Mobil Navigasyon & Hızlı Aksiyonlar
    mobileNavBtns: document.querySelectorAll('.mobile-nav-btn'),
    mobilePageBadge: document.getElementById('mobile-page-badge'),
    btnMobileDownloadPdf: document.getElementById('btn-mobile-download-pdf'),
    btnMobilePrint: document.getElementById('btn-mobile-print'),

    // Önizleme Çubuğu & Zoom
    previewPageCount: document.getElementById('preview-page-count'),
    previewOrientationLabel: document.getElementById('preview-orientation-label'),
    previewLayoutLabel: document.getElementById('preview-layout-label'),
    previewThemeLabel: document.getElementById('preview-theme-label'),
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnZoomFit: document.getElementById('btn-zoom-fit'),
    zoomText: document.getElementById('zoom-text'),

    // Bildirim
    toast: document.getElementById('toast-notification')
  };

  // ==========================================================================
  // 3. YARDIMCI BİLDİRİM FONKSİYONU (TOAST)
  // ==========================================================================
  function showToast(message, type = 'info', duration = 3000) {
    if (!el.toast) return;
    el.toast.textContent = message;
    el.toast.style.display = 'block';
    if (type === 'error') {
      el.toast.style.borderLeftColor = 'var(--ui-danger)';
    } else if (type === 'success') {
      el.toast.style.borderLeftColor = 'var(--ui-success)';
    } else {
      el.toast.style.borderLeftColor = 'var(--ui-accent)';
    }

    setTimeout(() => {
      el.toast.style.display = 'none';
    }, duration);
  }

  // ==========================================================================
  // 4. BAŞLANGIÇ YÜKLEMESİ (STORAGE VEYA ÖRNEK VERİ)
  // ==========================================================================
  function init() {
    document.body.dataset.mobileTab = state.mobileTab;

    const saved = localStorage.getItem('fotoalbum_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
      } catch (e) {
        console.warn('Kaydedilmiş veri yüklenemedi, örnek veri yükleniyor...', e);
        loadSampleData();
      }
    } else {
      loadSampleData();
    }

    syncInputsWithState();
    renderAlbum();
    renderEventsList();
    renderFormPhotos();
    renderCoverThumb();
    if (window.innerWidth < 900) {
      fitMobileZoom();
    } else {
      updateZoom();
    }
  }

  function loadSampleData() {
    if (window.SampleAlbumData) {
      state.theme = SampleAlbumData.theme;
      state.orientation = SampleAlbumData.orientation;
      state.layoutMode = 'split'; // Varsayılan olarak tek sayfa bölünmüş
      state.cover = { ...SampleAlbumData.cover };
      state.backCover = { ...SampleAlbumData.backCover };
      state.events = JSON.parse(JSON.stringify(SampleAlbumData.events));
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem('fotoalbum_state', JSON.stringify({
        orientation: state.orientation,
        layoutMode: state.layoutMode,
        theme: state.theme,
        cover: state.cover,
        backCover: state.backCover,
        events: state.events
      }));
    } catch (e) {
      console.warn('LocalStorage limitine ulaşıldı veya izin verilmedi.', e);
    }
  }

  // ==========================================================================
  // 5. EDİTÖR FORMLARI VE DURUM EŞİTLEME
  // ==========================================================================
  function syncInputsWithState() {
    // Yön butonları
    el.orientationBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.orientation === state.orientation);
    });

    // Düzen butonları
    el.layoutBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.layout === state.layoutMode);
    });

    // Tema kartları
    el.themeCards.forEach(card => {
      card.classList.toggle('active', card.dataset.theme === state.theme);
    });

    // Kapak alanları
    el.coverTitleInput.value = state.cover.title || '';
    el.coverSubtitleInput.value = state.cover.subtitle || '';
    el.coverDateInput.value = state.cover.date || '';

    // Arka kapak alanları
    el.backQuoteInput.value = state.backCover.quote || '';
    el.backAuthorInput.value = state.backCover.author || '';

    // Toolbar etiketleri
    updateToolbarStats();
  }

  function updateToolbarStats() {
    const themeNames = {
      minimalist: 'Klasik Minimalist',
      vintage: 'Vintage / Parşömen',
      romantic: 'Romantik Pastel',
      dark: 'Gece Galerisi'
    };
    const totalPages = state.layoutMode === 'split'
      ? 2 + state.events.length
      : 2 + (state.events.length * 2);

    el.previewPageCount.textContent = `Toplam ${totalPages} Sayfa (${state.events.length} Olay)`;
    if (el.mobilePageBadge) {
      el.mobilePageBadge.textContent = totalPages;
    }
    el.previewOrientationLabel.textContent = state.orientation === 'landscape' ? 'A4 Yatay' : 'A4 Dikey';
    if (el.previewLayoutLabel) {
      el.previewLayoutLabel.textContent = state.layoutMode === 'split' ? 'Tek Sayfa (Bölünmüş)' : 'İki Sayfa (Geniş)';
    }
    el.previewThemeLabel.textContent = themeNames[state.theme] || state.theme;
  }

  // ==========================================================================
  // 6. ALBÜM SAYFALARI OLUŞTURUCU (RENDER ENGINE)
  // ==========================================================================
  function renderAlbum() {
    const container = el.albumContainer;
    container.className = `album-container orientation-${state.orientation} theme-${state.theme}`;

    // Yazdırma CSS yön kuralını güncelle
    el.dynamicPrintStyle.textContent = `@page { size: A4 ${state.orientation}; margin: 0; }`;

    let html = '';
    let pageNumber = 1;

    // --- A. ÖN KAPAK (SAYFA NO YOK) ---
    const coverPhotoHtml = state.cover.photo ? `
      <div class="cover-photo-frame">
        <img src="${state.cover.photo}" alt="Kapak Fotoğrafı">
      </div>
    ` : `
      <div class="cover-photo-frame empty-collage" style="border: 2px dashed var(--border-color);">
        <div class="empty-icon">🖼️</div>
        <p style="font-size: 13px;">Kapak Fotoğrafı Eklenmedi</p>
      </div>
    `;

    html += `
      <section class="album-page page-cover" id="page-cover">
        <div class="cover-inner">
          <div class="cover-header">
            <div class="cover-tag">Özel Anı Albümü</div>
            <h1 class="cover-title">${escapeHtml(state.cover.title || 'Başlıksız Albüm')}</h1>
            ${state.cover.subtitle ? `<p class="cover-subtitle">${escapeHtml(state.cover.subtitle)}</p>` : ''}
          </div>

          <div class="cover-photo-wrapper">
            ${coverPhotoHtml}
          </div>

          <div class="cover-footer">
            <div class="cover-divider"></div>
            <div class="cover-date">${escapeHtml(state.cover.date || '')}</div>
          </div>
        </div>
      </section>
    `;

    // --- B. HER OLAY İÇİN SAYFALAR ---
    if (state.layoutMode === 'split') {
      // 1. TEK SAYFA DÜZENİ: Yarısı Başlık & Metin, Yarısı Fotoğraf Kolajı
      state.events.forEach((event) => {
        const eventPageNum = pageNumber++;
        const collageHtml = CollageBuilder.render(event.photos, state.theme, state.orientation);

        html += `
          <section class="album-page page-event-split" id="page-event-${event.id}">
            <div class="split-body">
              <div class="split-text-column">
                <div class="story-header">
                  ${event.date || event.location ? `
                    <div class="story-badge">
                      <span>📍</span>
                      <span>${escapeHtml([event.date, event.location].filter(Boolean).join(' • '))}</span>
                    </div>
                  ` : ''}
                </div>

                <div class="story-body">
                  <h2 class="story-title">${escapeHtml(event.title || 'Başlıksız Olay')}</h2>
                  <div class="story-divider"></div>
                  <p class="story-text">${escapeHtml(event.paragraph || '')}</p>
                </div>
              </div>

              <div class="split-collage-column">
                <div class="collage-wrapper">
                  ${collageHtml}
                </div>
              </div>
            </div>

            <div class="page-footer">
              <span class="page-watermark">${escapeHtml(state.cover.title || event.title || '')}</span>
              <span class="page-number">${eventPageNum}</span>
            </div>
          </section>
        `;
      });
    } else {
      // 2. İKİ SAYFA DÜZENİ: Sol Sayfa Metin, Sağ Sayfa Kolaj
      state.events.forEach((event) => {
        const storyPageNum = pageNumber++;
        const collagePageNum = pageNumber++;

        // Sayfa 1: Hikaye Sayfası (Sol)
        html += `
          <section class="album-page page-story" id="page-story-${event.id}">
            <div class="story-header">
              ${event.date || event.location ? `
                <div class="story-badge">
                  <span>📍</span>
                  <span>${escapeHtml([event.date, event.location].filter(Boolean).join(' • '))}</span>
                </div>
              ` : ''}
            </div>

            <div class="story-body">
              <h2 class="story-title">${escapeHtml(event.title || 'Başlıksız Olay')}</h2>
              <div class="story-divider"></div>
              <p class="story-text">${escapeHtml(event.paragraph || '')}</p>
            </div>

            <div class="page-footer">
              <span class="page-watermark">${escapeHtml(state.cover.title || '')}</span>
              <span class="page-number">${storyPageNum}</span>
            </div>
          </section>
        `;

        // Sayfa 2: Akıllı Kolaj Sayfası (Sağ)
        const collageHtml = CollageBuilder.render(event.photos, state.theme, state.orientation);

        html += `
          <section class="album-page page-collage" id="page-collage-${event.id}">
            <div class="collage-wrapper">
              ${collageHtml}
            </div>

            <div class="page-footer">
              <span class="page-watermark">${escapeHtml(event.title || '')}</span>
              <span class="page-number">${collagePageNum}</span>
            </div>
          </section>
        `;
      });
    }

    // --- C. ARKA KAPAK (SAYFA NO YOK) ---
    html += `
      <section class="album-page page-back-cover" id="page-back-cover">
        <div class="back-cover-inner">
          <div class="back-cover-icon">✦</div>
          ${state.backCover.quote ? `
            <div class="back-cover-quote">${escapeHtml(state.backCover.quote)}</div>
          ` : ''}
          <div class="cover-divider" style="margin-bottom: 20px;"></div>
          ${state.backCover.author ? `
            <div class="back-cover-author">${escapeHtml(state.backCover.author)}</div>
          ` : ''}
        </div>
      </section>
    `;

    container.innerHTML = html;
    updateToolbarStats();
    updateZoom();
  }

  // ==========================================================================
  // 7. OLAY LİSTESİ YÖNETİMİ
  // ==========================================================================
  function renderEventsList() {
    el.eventCountBadge.textContent = state.events.length;
    if (state.events.length === 0) {
      el.eventsListContainer.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--ui-text-muted); font-size: 13px;">
          Henüz olay eklenmedi. Yukarıdaki formdan yeni bir anı ekleyin.
        </div>
      `;
      return;
    }

    let listHtml = '';
    state.events.forEach((ev, idx) => {
      const isEditing = state.editingEventId === ev.id;
      listHtml += `
        <div class="event-card ${isEditing ? 'active' : ''}" data-id="${ev.id}">
          <div class="event-info">
            <div class="event-card-title">${idx + 1}. ${escapeHtml(ev.title || 'Başlıksız')}</div>
            <div class="event-card-meta">${ev.photos ? ev.photos.length : 0} Fotoğraf • ${escapeHtml(ev.date || 'Tarih belirtilmedi')}</div>
          </div>
          <div class="event-actions">
            <button type="button" class="btn-icon btn-edit-event" data-id="${ev.id}" title="Düzenle">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button type="button" class="btn-icon danger btn-delete-event" data-id="${ev.id}" title="Sil">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;
    });

    el.eventsListContainer.innerHTML = listHtml;

    // Dinleyiciler
    el.eventsListContainer.querySelectorAll('.btn-edit-event').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        startEditingEvent(id);
      });
    });

    el.eventsListContainer.querySelectorAll('.btn-delete-event').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        deleteEvent(id);
      });
    });
  }

  function startEditingEvent(id) {
    const event = state.events.find(e => e.id === id);
    if (!event) return;

    if (state.mobileTab !== 'edit') {
      setMobileTab('edit');
    }

    state.editingEventId = id;
    el.editingEventIdInput.value = id;
    el.formHeading.textContent = 'Anıyı Düzenle';
    el.btnSaveEvent.innerHTML = '<span>Değişiklikleri Kaydet</span>';
    el.btnCancelEdit.style.display = 'inline-flex';

    el.eventTitleInput.value = event.title || '';
    el.eventLocationInput.value = [event.date, event.location].filter(Boolean).join(' • ');
    el.eventParagraphInput.value = event.paragraph || '';
    updateCharCounter();

    state.currentFormPhotos = [...(event.photos || [])];
    renderFormPhotos();
    renderEventsList();

    // Forma yumuşak kaydır
    el.eventTitleInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.eventTitleInput.focus();
  }

  function cancelEditingEvent() {
    state.editingEventId = null;
    el.editingEventIdInput.value = '';
    el.formHeading.textContent = 'Yeni Anı Ekle';
    el.btnSaveEvent.innerHTML = '<span>Anıyı Albüme Ekle</span>';
    el.btnCancelEdit.style.display = 'none';

    el.eventTitleInput.value = '';
    el.eventLocationInput.value = '';
    el.eventParagraphInput.value = '';
    updateCharCounter();

    state.currentFormPhotos = [];
    renderFormPhotos();
    renderEventsList();
  }

  function deleteEvent(id) {
    if (!confirm('Bu olayı ve sayfalarını silmek istediğinize emin misiniz?')) return;

    if (state.editingEventId === id) {
      cancelEditingEvent();
    }

    state.events = state.events.filter(e => e.id !== id);
    saveToStorage();
    renderEventsList();
    renderAlbum();
    showToast('Olay albümden kaldırıldı.', 'info');
  }

  // ==========================================================================
  // 8. FOTOĞRAF ÖNİZLEME VE YÜKLEME KONTROLLERİ
  // ==========================================================================
  function renderFormPhotos() {
    const photos = state.currentFormPhotos;
    el.photoCountBadge.textContent = `${photos.length} / 4 Fotoğraf`;

    if (photos.length >= 4) {
      el.photoCountBadge.classList.add('warning');
    } else {
      el.photoCountBadge.classList.remove('warning');
    }

    let html = '';
    photos.forEach((src, idx) => {
      html += `
        <div class="thumb-item">
          <img src="${src}" alt="Önizleme ${idx + 1}">
          <button type="button" class="thumb-remove" data-index="${idx}" title="Kaldır">✕</button>
        </div>
      `;
    });

    el.eventThumbsPreview.innerHTML = html;

    el.eventThumbsPreview.querySelectorAll('.thumb-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        state.currentFormPhotos.splice(idx, 1);
        renderFormPhotos();
      });
    });
  }

  function renderCoverThumb() {
    if (!state.cover.photo) {
      el.coverThumbPreview.innerHTML = '';
      return;
    }

    el.coverThumbPreview.innerHTML = `
      <div class="thumb-item">
        <img src="${state.cover.photo}" alt="Kapak">
        <button type="button" class="thumb-remove" id="btn-remove-cover-photo" title="Kapağı Kaldır">✕</button>
      </div>
    `;

    document.getElementById('btn-remove-cover-photo')?.addEventListener('click', () => {
      state.cover.photo = '';
      renderCoverThumb();
      renderAlbum();
      saveToStorage();
    });
  }

  // ==========================================================================
  // 9. DİNLENEN OLAYLAR (EVENT LISTENERS)
  // ==========================================================================

  // A. Sayfa Yönü (Landscape / Portrait)
  el.orientationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const orientation = btn.dataset.orientation;
      if (state.orientation === orientation) return;

      state.orientation = orientation;
      el.orientationBtns.forEach(b => b.classList.toggle('active', b === btn));
      renderAlbum();
      if (window.innerWidth < 900) {
        fitMobileZoom();
      }
      saveToStorage();
      showToast(`Sayfa yönü: ${orientation === 'landscape' ? 'A4 Yatay' : 'A4 Dikey'} olarak güncellendi.`);
    });
  });

  // B. Sayfa Düzeni (Split / Spread)
  el.layoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const layout = btn.dataset.layout;
      if (state.layoutMode === layout) return;

      state.layoutMode = layout;
      el.layoutBtns.forEach(b => b.classList.toggle('active', b === btn));
      renderAlbum();
      saveToStorage();
      showToast(`Sayfa düzeni: ${layout === 'split' ? 'Tek Sayfa (Bölünmüş)' : 'İki Sayfa (Geniş)'} olarak güncellendi.`);
    });
  });

  // C. Tema Seçimi
  el.themeCards.forEach(card => {
    card.addEventListener('click', () => {
      const theme = card.dataset.theme;
      state.theme = theme;
      el.themeCards.forEach(c => c.classList.toggle('active', c === card));
      renderAlbum();
      saveToStorage();
      showToast('Tema başarıyla güncellendi.');
    });
  });

  // C. Kapak Formu Canlı Güncelleme
  el.coverTitleInput.addEventListener('input', (e) => {
    state.cover.title = e.target.value;
    renderAlbum();
    saveToStorage();
  });
  el.coverSubtitleInput.addEventListener('input', (e) => {
    state.cover.subtitle = e.target.value;
    renderAlbum();
    saveToStorage();
  });
  el.coverDateInput.addEventListener('input', (e) => {
    state.cover.date = e.target.value;
    renderAlbum();
    saveToStorage();
  });

  // Kapak Fotoğrafı Sürükle-Bırak ve Seçim
  el.coverDropzone.addEventListener('click', () => el.coverFileInput.click());

  ['dragenter', 'dragover'].forEach(eventName => {
    el.coverDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.coverDropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    el.coverDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.coverDropzone.classList.remove('dragover');
    });
  });

  async function handleCoverFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    showToast('Kapak fotoğrafı 1080p’ye optimize ediliyor...', 'info');
    try {
      const result = await ImageProcessor.processImage(file);
      state.cover.photo = result.dataUrl;
      renderCoverThumb();
      renderAlbum();
      saveToStorage();
      showToast(`Kapak yüklendi (${result.sizeKB} KB).`, 'success');
    } catch (err) {
      showToast('Fotoğraf işlenirken hata oluştu.', 'error');
    }
  }

  el.coverDropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCoverFile(e.dataTransfer.files[0]);
    }
  });

  el.coverFileInput.addEventListener('change', async (e) => {
    if (e.target.files && e.target.files[0]) {
      handleCoverFile(e.target.files[0]);
    }
  });

  // D. Olay Formu Karakter Sayacı
  function updateCharCounter() {
    const len = el.eventParagraphInput.value.length;
    el.charCounter.textContent = `${len} / 550`;
    el.charCounter.classList.remove('warning', 'danger');
    if (len >= 540) {
      el.charCounter.classList.add('danger');
    } else if (len >= 480) {
      el.charCounter.classList.add('warning');
    }
  }
  el.eventParagraphInput.addEventListener('input', updateCharCounter);

  // Olay Fotoğrafları Sürükle-Bırak ve Seçim
  el.eventDropzone.addEventListener('click', () => el.eventFilesInput.click());

  ['dragenter', 'dragover'].forEach(eventName => {
    el.eventDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.eventDropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    el.eventDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.eventDropzone.classList.remove('dragover');
    });
  });

  async function handleEventFiles(filesList) {
    const files = Array.from(filesList).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;

    const availableSlots = 4 - state.currentFormPhotos.length;
    if (availableSlots <= 0) {
      showToast('En fazla 4 fotoğraf ekleyebilirsiniz.', 'error');
      return;
    }

    const filesToProcess = files.slice(0, availableSlots);
    showToast(`${filesToProcess.length} fotoğraf 1080p'ye optimize ediliyor...`, 'info');

    try {
      const results = await ImageProcessor.processMultiple(filesToProcess);
      results.forEach(res => {
        state.currentFormPhotos.push(res.dataUrl);
      });
      renderFormPhotos();
      showToast('Fotoğraflar başarıyla optimize edildi ve eklendi.', 'success');
    } catch (err) {
      showToast('Fotoğraflar işlenirken hata oluştu.', 'error');
    }
  }

  el.eventDropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files) {
      handleEventFiles(e.dataTransfer.files);
    }
  });

  el.eventFilesInput.addEventListener('change', (e) => {
    if (e.target.files) {
      handleEventFiles(e.target.files);
    }
    el.eventFilesInput.value = '';
  });

  // Olay Kaydet / Güncelle
  el.btnSaveEvent.addEventListener('click', () => {
    const title = el.eventTitleInput.value.trim();
    const location = el.eventLocationInput.value.trim();
    const paragraph = el.eventParagraphInput.value.trim();

    if (!title) {
      showToast('Lütfen olaya bir başlık verin.', 'error');
      el.eventTitleInput.focus();
      return;
    }

    if (!paragraph) {
      showToast('Lütfen anınızla ilgili bir paragraf yazın.', 'error');
      el.eventParagraphInput.focus();
      return;
    }

    if (state.currentFormPhotos.length === 0) {
      if (!confirm('Bu olay için henüz hiç fotoğraf eklemediniz. Yine de kaydetmek istiyor musunuz?')) {
        return;
      }
    }

    if (state.editingEventId) {
      // Güncelle
      const event = state.events.find(e => e.id === state.editingEventId);
      if (event) {
        event.title = title;
        event.location = location;
        event.paragraph = paragraph;
        event.photos = [...state.currentFormPhotos];
        showToast('Olay başarıyla güncellendi.', 'success');
      }
      cancelEditingEvent();
    } else {
      // Yeni Ekle
      const newEvent = {
        id: 'evt-' + Date.now(),
        title,
        location,
        paragraph,
        photos: [...state.currentFormPhotos]
      };
      state.events.push(newEvent);
      showToast('Yeni olay albüme eklendi (2 yeni sayfa oluşturuldu).', 'success');

      // Formu temizle
      el.eventTitleInput.value = '';
      el.eventLocationInput.value = '';
      el.eventParagraphInput.value = '';
      updateCharCounter();
      state.currentFormPhotos = [];
      renderFormPhotos();
    }

    saveToStorage();
    renderEventsList();
    renderAlbum();
  });

  el.btnCancelEdit.addEventListener('click', cancelEditingEvent);

  // E. Arka Kapak Canlı Güncelleme
  el.backQuoteInput.addEventListener('input', (e) => {
    state.backCover.quote = e.target.value;
    renderAlbum();
    saveToStorage();
  });
  el.backAuthorInput.addEventListener('input', (e) => {
    state.backCover.author = e.target.value;
    renderAlbum();
    saveToStorage();
  });

  // F. Üst Butonlar
  el.btnLoadSample.addEventListener('click', () => {
    if (confirm('Mevcut albümün üzerine hazır örnek anılar ve fotoğraflar yüklensin mi?')) {
      loadSampleData();
      syncInputsWithState();
      cancelEditingEvent();
      renderAlbum();
      renderEventsList();
      renderCoverThumb();
      saveToStorage();
      showToast('Örnek albüm başarıyla yüklendi!', 'success');
    }
  });

  el.btnPrint.addEventListener('click', () => {
    PDFExporter.printAlbum();
  });

  el.btnDownloadPdf.addEventListener('click', async () => {
    const filename = (state.cover.title || 'fotograf-albumum')
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '_') + '.pdf';
    
    el.btnDownloadPdf.disabled = true;
    if (el.btnMobileDownloadPdf) el.btnMobileDownloadPdf.disabled = true;
    const oldText = el.btnDownloadPdf.innerHTML;
    const oldMobileText = el.btnMobileDownloadPdf ? el.btnMobileDownloadPdf.innerHTML : '';
    el.btnDownloadPdf.innerHTML = '<span>⏳</span> Hazırlanıyor...';
    if (el.btnMobileDownloadPdf) el.btnMobileDownloadPdf.innerHTML = '<span>⏳</span> Hazırlanıyor...';

    await PDFExporter.downloadPDF(
      el.albumContainer,
      state.orientation,
      filename,
      (msg) => showToast(msg, 'info')
    );

    el.btnDownloadPdf.disabled = false;
    el.btnDownloadPdf.innerHTML = oldText;
    if (el.btnMobileDownloadPdf) {
      el.btnMobileDownloadPdf.disabled = false;
      el.btnMobileDownloadPdf.innerHTML = oldMobileText;
    }
  });

  if (el.btnLoadSampleSidebar) {
    el.btnLoadSampleSidebar.addEventListener('click', () => {
      el.btnLoadSample.click();
    });
  }

  el.btnResetAlbum.addEventListener('click', () => {
    if (confirm('Tüm albüm ve eklenen anılar silinsin mi? Bu işlem geri alınamaz.')) {
      state.cover = { title: '', subtitle: '', date: '', photo: '' };
      state.events = [];
      state.backCover = { quote: '', author: '' };
      state.currentFormPhotos = [];
      cancelEditingEvent();
      syncInputsWithState();
      renderAlbum();
      renderEventsList();
      renderCoverThumb();
      renderFormPhotos();
      localStorage.removeItem('fotoalbum_state');
      showToast('Albüm sıfırlandı.', 'info');
    }
  });

  // G. Zoom Kontrolleri ve Mobil Otomatik Sığdırma
  function updateZoom() {
    if (el.zoomText) {
      el.zoomText.textContent = `${Math.round(state.zoom * 100)}%`;
    }
    if (el.albumContainer) {
      el.albumContainer.style.transform = `scale(${state.zoom})`;
      el.albumContainer.style.transformOrigin = 'top center';

      // CSS Transform ölçeklemesinden kaynaklanan boşluk farkını (phantom scroll) dengele
      const unscaledHeight = el.albumContainer.offsetHeight;
      if (unscaledHeight > 0) {
        const scaledHeight = unscaledHeight * state.zoom;
        const heightDiff = unscaledHeight - scaledHeight;
        el.albumContainer.style.marginBottom = `-${Math.max(0, heightDiff)}px`;
      }
    }
  }

  function fitMobileZoom() {
    const viewportWidth = el.albumViewport ? (el.albumViewport.clientWidth - 20) : (window.innerWidth - 20);
    const pageWidthMm = state.orientation === 'landscape' ? 297 : 210;
    // 1mm ~ 3.78px at 96 DPI
    const estimatedPx = pageWidthMm * 3.78;
    const availableWidth = Math.max(viewportWidth, 260);
    const fitRatio = Math.min(Math.max(availableWidth / estimatedPx, 0.2), 1.0);
    state.zoom = Math.round(fitRatio * 100) / 100;
    updateZoom();
  }

  function setMobileTab(tab) {
    state.mobileTab = tab;
    document.body.dataset.mobileTab = tab;
    if (el.mobileNavBtns) {
      el.mobileNavBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
      });
    }

    if (tab === 'preview') {
      // Sekme açıldığında içeriği ölçüp ekrana tam sığdır
      requestAnimationFrame(() => {
        fitMobileZoom();
        if (el.albumViewport) {
          el.albumViewport.scrollTop = 0;
        }
      });
    }
  }

  el.btnZoomIn.addEventListener('click', () => {
    if (state.zoom < 1.5) {
      state.zoom += 0.1;
      updateZoom();
    }
  });

  el.btnZoomOut.addEventListener('click', () => {
    if (state.zoom > 0.3) {
      state.zoom -= 0.1;
      updateZoom();
    }
  });

  el.btnZoomFit.addEventListener('click', () => {
    const viewportWidth = el.albumViewport ? (el.albumViewport.clientWidth - 32) : (window.innerWidth - 32);
    const pageWidthMm = state.orientation === 'landscape' ? 297 : 210;
    const estimatedPx = pageWidthMm * 3.78;
    const fitRatio = Math.min(Math.max(viewportWidth / estimatedPx, 0.2), 1.2);
    state.zoom = Math.round(fitRatio * 100) / 100;
    updateZoom();
  });

  // H. Mobil Dinleyiciler
  if (el.mobileNavBtns) {
    el.mobileNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab) setMobileTab(tab);
      });
    });
  }

  if (el.btnMobileDownloadPdf) {
    el.btnMobileDownloadPdf.addEventListener('click', () => {
      el.btnDownloadPdf.click();
    });
  }

  if (el.btnMobilePrint) {
    el.btnMobilePrint.addEventListener('click', () => {
      el.btnPrint.click();
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth < 900 && state.mobileTab === 'preview') {
      fitMobileZoom();
    }
  });

  // ==========================================================================
  // 10. GÜVENLİK VE KAÇIŞ FONKSİYONLARI (XSS KORUMASI)
  // ==========================================================================
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Başlat!
  init();
});
