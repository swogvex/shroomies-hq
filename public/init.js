// Runs before first paint (blocking, external so the CSP needs no inline hash): theme, calm mode, time slot.
(function () {
  var d = document.documentElement;
  var t = null, calm = null;
  try { t = localStorage.getItem('shq:theme'); calm = localStorage.getItem('shq:calm'); } catch (e) {}
  d.dataset.theme = t === 'original' || t === 'light' || t === 'dark' ? t
    : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'original';
  if (calm === 'on') d.dataset.calm = '';
  var h = new Date().getHours();
  d.dataset.slot = h >= 6 && h < 12 ? 'morning' : h >= 12 && h < 18 ? 'afternoon' : h >= 18 && h < 21 ? 'sunset' : 'night';
})();
