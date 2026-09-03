// Mobile navigation
const menuButton = document.querySelector('.menu-button');
const mainNav = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mainNav.classList.toggle('is-open', !open);
});

mainNav?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  menuButton?.setAttribute('aria-expanded', 'false');
  mainNav.classList.remove('is-open');
});


// Horizontal filmstrip
const filmstrip = document.querySelector('[data-filmstrip]');
const previousStripButton = document.querySelector('[data-strip-prev]');
const nextStripButton = document.querySelector('[data-strip-next]');

const updateStripButtons = () => {
  if (!filmstrip) return;
  const maximumScroll = filmstrip.scrollWidth - filmstrip.clientWidth;
  previousStripButton.disabled = filmstrip.scrollLeft <= 2;
  nextStripButton.disabled = filmstrip.scrollLeft >= maximumScroll - 2;
};

const scrollStrip = (direction) => {
  if (!filmstrip) return;
  const firstFrame = filmstrip.querySelector('.image-button');
  const gap = Number.parseFloat(getComputedStyle(filmstrip).columnGap) || 0;
  const frameWidth = firstFrame?.getBoundingClientRect().width || filmstrip.clientWidth * 0.4;
  const visibleFrames = Math.max(1, Math.floor(filmstrip.clientWidth / (frameWidth + gap)) - 1);
  filmstrip.scrollBy({ left: direction * (frameWidth + gap) * visibleFrames, behavior: 'smooth' });
};

previousStripButton?.addEventListener('click', () => scrollStrip(-1));
nextStripButton?.addEventListener('click', () => scrollStrip(1));
filmstrip?.addEventListener('scroll', updateStripButtons, { passive: true });
window.addEventListener('resize', updateStripButtons);
updateStripButtons();


// Recent stories switcher
const storyFeature = document.querySelector('[data-story-feature]');
const storyImageButton = document.querySelector('[data-story-image-button]');
const storyImage = document.querySelector('[data-story-image]');
const storyCategory = document.querySelector('[data-story-category]');
const storyTitle = document.querySelector('[data-story-title]');
const storyDescription = document.querySelector('[data-story-description]');
let storyChangeTimer;

document.querySelectorAll('[data-story-select]').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;

    document.querySelectorAll('[data-story-select]').forEach((storyButton) => {
      const isSelected = storyButton === button;
      storyButton.setAttribute('aria-pressed', String(isSelected));
      storyButton.closest('li')?.classList.toggle('is-active', isSelected);
    });

    window.clearTimeout(storyChangeTimer);
    storyFeature?.classList.add('is-changing');
    storyChangeTimer = window.setTimeout(() => {
      storyImage.src = button.dataset.image;
      storyImage.alt = button.dataset.alt;
      storyImageButton.dataset.lightbox = button.dataset.image;
      storyImageButton.setAttribute('aria-label', `Open ${button.dataset.title} photograph`);
      storyCategory.textContent = button.dataset.category;
      storyTitle.textContent = button.dataset.title;
      storyDescription.textContent = button.dataset.description;
      storyFeature?.classList.remove('is-changing');
    }, 150);
  });
});


// Selected work slider
const mosaicSlider = document.querySelector('[data-mosaic-slider]');
const mosaicTrack = document.querySelector('[data-mosaic-track]');
const mosaicSlides = [...document.querySelectorAll('.mosaic-slide')];
const mosaicPrevious = document.querySelector('[data-mosaic-prev]');
const mosaicNext = document.querySelector('[data-mosaic-next]');
const mosaicCounter = document.querySelector('[data-mosaic-counter]');
let activeMosaicSlide = 0;

const showMosaicSlide = (index) => {
  if (!mosaicTrack || !mosaicSlides.length) return;
  activeMosaicSlide = Math.max(0, Math.min(index, mosaicSlides.length - 1));
  mosaicTrack.style.transform = `translateX(-${activeMosaicSlide * 100}%)`;
  mosaicSlides.forEach((slide, slideIndex) => {
    const isHidden = slideIndex !== activeMosaicSlide;
    slide.setAttribute('aria-hidden', String(isHidden));
    slide.inert = isHidden;
  });
  mosaicCounter.textContent = `${String(activeMosaicSlide + 1).padStart(2, '0')} / ${String(mosaicSlides.length).padStart(2, '0')}`;
  mosaicPrevious.disabled = activeMosaicSlide === 0;
  mosaicNext.disabled = activeMosaicSlide === mosaicSlides.length - 1;
};

mosaicPrevious?.addEventListener('click', () => showMosaicSlide(activeMosaicSlide - 1));
mosaicNext?.addEventListener('click', () => showMosaicSlide(activeMosaicSlide + 1));
mosaicSlider?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showMosaicSlide(activeMosaicSlide - 1);
  if (event.key === 'ArrowRight') showMosaicSlide(activeMosaicSlide + 1);
});


// Image lightbox
const dialog = document.querySelector('[data-lightbox-dialog]');
const dialogImage = document.querySelector('[data-lightbox-image]');

document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    dialogImage.src = button.dataset.lightbox;
    dialog.showModal();
  });
});

document.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});


// Inquiry dialog
const contactDialog = document.querySelector('[data-contact-dialog]');
const contactForm = document.querySelector('[data-contact-form]');

document.querySelectorAll('[data-contact-open]').forEach((button) => {
  button.addEventListener('click', () => contactDialog?.showModal());
});


document.querySelector('[data-contact-close]')?.addEventListener('click', () => contactDialog?.close());
contactDialog?.addEventListener('click', (event) => {
  if (event.target === contactDialog) contactDialog?.close();
});

const successDialog = document.querySelector('[data-success-dialog]');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  contactDialog?.close();
  event.currentTarget.reset();
  successDialog?.showModal();
});

document.querySelectorAll('[data-success-close]').forEach((button) => {
  button.addEventListener('click', () => successDialog?.close());
});

successDialog?.addEventListener('click', (event) => {
  if (event.target === successDialog) successDialog.close();
});
