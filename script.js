// sticky nav border
  var nav = document.getElementById('nav');
  var onScroll = function(){ nav.classList.toggle('scrolled', window.scrollY > 12); };
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // staggered reveal
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){
          var el = e.target;
          var sibs = Array.prototype.slice.call(el.parentNode.children).filter(function(c){return c.classList.contains('reveal');});
          var i = sibs.indexOf(el);
          el.style.transitionDelay = Math.min(i,6)*70 + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
    items.forEach(function(el){ io.observe(el); });
  }

  // lightbox for commendation
  var lb=document.getElementById('lightbox');
  var lbImg=document.getElementById('lb-img');
  function openLb(src){ lbImg.src=src; lb.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeLb(){ lb.classList.remove('open'); document.body.style.overflow=''; }
  Array.prototype.forEach.call(document.querySelectorAll('[data-zoom]'), function(fig){
    var img=fig.querySelector('img');
    fig.addEventListener('click', function(){ openLb(img.src); });
    fig.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openLb(img.src); } });
  });
  if(lb){ lb.addEventListener('click', closeLb);
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeLb(); });
  }
