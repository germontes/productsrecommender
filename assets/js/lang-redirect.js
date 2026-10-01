// Root "/" redirect: saved choice first, then browser language, else Spanish.
(function () {
  var lang = null;
  try { lang = localStorage.getItem('pr-lang'); } catch (e) {}
  if (lang !== 'es' && lang !== 'en') {
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'es';
    lang = /^en/i.test(nav) ? 'en' : 'es';
  }
  window.location.replace('/' + lang + '/');
})();
