// Mobile menu, remembered language, demo newsletter form.
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Remember the chosen language so "/" redirects to it next time.
  document.querySelectorAll('[data-set-lang]').forEach(function (link) {
    link.addEventListener('click', function () {
      try { localStorage.setItem('pr-lang', link.getAttribute('data-set-lang')); } catch (e) {}
    });
  });
  try { localStorage.setItem('pr-lang', document.documentElement.lang); } catch (e) {}

  // Newsletter is not connected to a provider yet (SPEC Q5): show a demo message.
  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var msg = form.querySelector('.newsletter-msg');
      if (msg) msg.textContent = form.getAttribute('data-thanks');
      form.reset();
    });
  });
})();
