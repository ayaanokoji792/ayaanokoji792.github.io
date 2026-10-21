// ------------------------------------------------------------
// Light / dark toggle
// (the <head> of each page applies a saved choice before paint)
// ------------------------------------------------------------
(function () {
  var root = document.documentElement;
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function current() {
    return root.dataset.theme || (media.matches ? 'dark' : 'light');
  }

  function render() {
    var dark = current() === 'dark';
    btn.textContent = dark ? '☀' : '☾';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    render();
  });

  media.addEventListener('change', render);
  render();
})();

// ------------------------------------------------------------
// "last tended" date
// GitHub Pages sends a Last-Modified header, so this updates
// itself every time you push. The text inside the <time> tag
// is only a fallback.
// ------------------------------------------------------------
(function () {
  var el = document.getElementById('updated');
  if (!el) return;

  var modified = new Date(document.lastModified);
  // Without a Last-Modified header, browsers report "right now", so ignore that.
  if (isNaN(modified) || Date.now() - modified.getTime() < 10000) return;

  el.dateTime = modified.toISOString().slice(0, 10);
  el.textContent = modified.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
})();

// Copyright year
document.querySelectorAll('.year').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// ------------------------------------------------------------
// Photo lightbox (only runs on the photos page)
// ------------------------------------------------------------
(function () {
  var gallery = document.querySelector('.gallery');
  if (!gallery) return;

  var figures = Array.prototype.slice.call(gallery.querySelectorAll('figure'));
  var empty = document.querySelector('.empty');
  if (empty) empty.hidden = figures.length > 0;
  if (!figures.length) return;

  var dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.innerHTML =
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button class="lb-prev" aria-label="Previous photo">←</button>' +
    '<button class="lb-next" aria-label="Next photo">→</button>' +
    '<button class="lb-close" aria-label="Close">✕</button>';
  document.body.appendChild(dialog);

  var img = dialog.querySelector('img');
  var cap = dialog.querySelector('figcaption');
  var index = 0;

  function show(i) {
    index = (i + figures.length) % figures.length;
    var src = figures[index].querySelector('img');
    var text = figures[index].querySelector('figcaption');
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    cap.textContent = text ? text.textContent : '';
  }

  figures.forEach(function (fig, i) {
    fig.tabIndex = 0;
    fig.addEventListener('click', function () { show(i); dialog.showModal(); });
    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { show(i); dialog.showModal(); }
    });
  });

  dialog.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
  dialog.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });
  dialog.querySelector('.lb-close').addEventListener('click', function () { dialog.close(); });

  // Click on the dark backdrop closes it
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });

  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();
