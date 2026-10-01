// Price-tier filter for section pages (SPEC §9.1). Without JS every product stays visible.
(function () {
  var root = document.querySelector('[data-filter-root]');
  if (!root) return;

  var chips = document.querySelectorAll('.filters .chip');
  var status = document.querySelector('.filter-status');
  var empty = root.querySelector('.filter-empty');
  var cards = root.querySelectorAll('.product-card[data-tier]');
  var groups = root.querySelectorAll('.category-group');

  function apply(tier) {
    var shown = 0;
    cards.forEach(function (card) {
      var match = tier === 'all' || card.getAttribute('data-tier') === tier;
      card.hidden = !match;
      if (match) shown++;
    });
    groups.forEach(function (group) {
      group.hidden = !group.querySelector('.product-card:not([hidden])');
    });
    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', chip.getAttribute('data-tier') === tier ? 'true' : 'false');
    });
    if (status) {
      status.textContent = status.getAttribute('data-template')
        .replace('{shown}', shown)
        .replace('{total}', cards.length);
    }
    if (empty) empty.hidden = shown !== 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () { apply(chip.getAttribute('data-tier')); });
  });
  apply('all');
})();
