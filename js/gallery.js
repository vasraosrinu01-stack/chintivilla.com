/**
 * FRNDSPACE LUXURY NIGHT VILLA - GALLERY & LIGHTBOX ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentIndex = 0;
  let visibleItems = Array.from(galleryItems);

  // Filter Categories
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          item.classList.add('reveal');
          setTimeout(() => item.classList.add('active'), 50);
        } else {
          item.style.display = 'none';
          item.classList.remove('active');
        }
      });

      visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
    });
  });

  // Open Lightbox
  function openLightbox(index) {
    if (!visibleItems[index] || !lightboxModal) return;
    currentIndex = index;
    const item = visibleItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-title')?.textContent || '';
    const subtitle = item.querySelector('.gallery-subtitle')?.textContent || '';

    lightboxImg.src = img.src;
    lightboxCaption.innerHTML = `<strong>${title}</strong> — ${subtitle}`;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close Lightbox
  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Next / Prev
  function showNext() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const idx = visibleItems.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
});
