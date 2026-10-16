/* movimento.js — movimento DESTE site, reproduzido de jocidietitian.com (Kit de Design, seção "Movimento"; design.md §10).
   Só transform e opacity, IntersectionObserver, curva cubic-bezier(.2,.7,.2,1) no CSS.
   main.js e base.css não se editam. Com prefers-reduced-motion nada aqui roda e tudo aparece (style.css). */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var raiz = document.documentElement;
  raiz.classList.add('mov');

  /* §10.7 Cabeçalho: transparente no topo; depois de 40 px de rolagem, papel 82% + blur 14 px (fixo, nunca some) */
  var cab = document.querySelector('[data-header]');
  if (cab) {
    var solido = function (y) { cab.toggleAttribute('data-solido', y > 40); };
    solido(window.scrollY);
    window.addEventListener('scroll', function () { solido(window.scrollY); }, { passive: true });
    if (window.__lenis) window.__lenis.on('scroll', function (e) { solido(e.scroll); });
  }

  /* §10.3 Herói ao carregar: rótulo → nome → subtítulo → botões → chips, 70 ms entre linhas; foto em fade 0,8 s.
     Tudo começa antes de 600 ms. */
  var carga = document.querySelectorAll('.rv-carga');
  carga.forEach(function (el, i) { el.style.setProperty('--atraso', (i * 0.07).toFixed(2) + 's'); });
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      carga.forEach(function (el) { el.classList.add('in'); });
      document.querySelectorAll('[data-heroi] .rv-foto').forEach(function (el) { el.classList.add('in'); });
    });
  });

  /* §10.1 / §10.2 Blocos e cards: fade + sobe 18 px em 0,7 s ao entrar na tela; irmãos escalonados em 70 ms (máx. 6).
     A entrada vai sempre num invólucro (li, div), nunca no elemento com hover. */
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.rv, .rv-foto, .caminho').forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      if (el.classList.contains('rv')) {
        var irmaos = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains('rv'); });
        var i = Math.min(irmaos.indexOf(el), 5);
        el.style.setProperty('--atraso', (i * 0.07).toFixed(2) + 's');
      }
      el.classList.add('in');
      obs.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.rv, main .rv-foto:not([data-heroi] .rv-foto)').forEach(function (el) { obs.observe(el); });

  /* §10.4 Como funciona: a foto entra em fade 0,8 s; os marcadores do caminho 1-2-3 aparecem em seguida, 70 ms cada */
  var caminho = document.querySelector('.caminho');
  if (caminho) {
    caminho.querySelectorAll('.caminho__marco').forEach(function (m, i) { m.style.setProperty('--atraso', (0.35 + i * 0.07).toFixed(2) + 's'); });
    var obsCaminho = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { caminho.classList.add('in'); obsCaminho.disconnect(); }
    }, { threshold: 0.3 });
    obsCaminho.observe(caminho);
  }
})();
