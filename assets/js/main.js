// Sticky nav background
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const toggle = document.querySelector('.nav__toggle');
const links = document.querySelector('.nav__links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', false);
}));

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Gallery: tiles with a data-img show that photo as background
document.querySelectorAll('.tile[data-img]').forEach(tile => {
  const src = tile.dataset.img;
  if (src) {
    tile.style.backgroundImage = `url("${src}")`;
    tile.classList.add('has-img');
  }
});

// Booking form -> pre-filled WhatsApp message
document.getElementById('bookForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const lines = [
    'Hello Saddam sir, I would like to book a training.',
    `Name: ${f.get('name')}`,
    `Institution: ${f.get('org')} (${f.get('type')})`,
    `Topic: ${f.get('topic')}`,
    f.get('size') && `Participants: ${f.get('size')}`,
    f.get('date') && `Preferred date: ${f.get('date')}`,
    f.get('msg') && `Message: ${f.get('msg')}`,
  ].filter(Boolean);
  window.open(`https://wa.me/8801717059472?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
});

document.getElementById('year').textContent = new Date().getFullYear();

// Album lightbox
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('img');
const lbCap = lightbox.querySelector('.lightbox__caption');
document.querySelectorAll('.album__item').forEach(item => item.addEventListener('click', () => {
  const img = item.querySelector('img');
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCap.textContent = item.querySelector('figcaption').textContent;
  lightbox.hidden = false;
}));
lightbox.addEventListener('click', e => { if (e.target !== lbImg) lightbox.hidden = true; });
document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.hidden = true; });

// Program "Enquire" buttons pre-select their topic in the booking form
const topicSelect = document.querySelector('#bookForm select[name="topic"]');
document.querySelectorAll('[data-topic]').forEach(btn => btn.addEventListener('click', () => {
  topicSelect.value = btn.dataset.topic;
}));

// Highlight the nav link for the section in view
const navLinks = [...links.querySelectorAll('a:not(.btn)')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = e.target.classList.contains('hero') ? '#top' : `#${e.target.id}`;
    navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['top', 'programs', 'about', 'highlights', 'book'].forEach(id => {
  const el = document.getElementById(id === 'top' ? 'top' : id);
  if (el) spy.observe(id === 'top' ? document.querySelector('.hero') : el);
});
