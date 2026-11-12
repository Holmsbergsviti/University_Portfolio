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

  // lightbox: one image (commendation) or a set of pages (certificates, reports)
  var lb=document.getElementById('lightbox');
  var lbImg=document.getElementById('lb-img');
  var lbPrev=lb.querySelector('.lb-prev'), lbNext=lb.querySelector('.lb-next'), lbCount=lb.querySelector('.lb-count');
  var pages=[], page=0;
  function show(){
    lbImg.src=pages[page];
    var multi=pages.length>1;
    lbPrev.hidden=lbNext.hidden=lbCount.hidden=!multi;
    if(multi) lbCount.textContent=(page+1)+' / '+pages.length;
  }
  function openLb(list, alt){
    pages=[].concat(list); page=0; lbImg.alt=alt||'Document, enlarged';
    show(); lb.classList.add('open'); document.body.style.overflow='hidden';
  }
  function closeLb(){ lb.classList.remove('open'); document.body.style.overflow=''; }
  function step(d){ if(pages.length>1){ page=(page+d+pages.length)%pages.length; show(); } }
  lbPrev.addEventListener('click', function(e){ e.stopPropagation(); step(-1); });
  lbNext.addEventListener('click', function(e){ e.stopPropagation(); step(1); });
  lbImg.addEventListener('click', function(e){ if(pages.length>1){ e.stopPropagation(); step(1); } });
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape') closeLb();
    else if(e.key==='ArrowRight') step(1);
    else if(e.key==='ArrowLeft') step(-1);
  });

  Array.prototype.forEach.call(document.querySelectorAll('[data-zoom]'), function(fig){
    var img=fig.querySelector('img');
    fig.addEventListener('click', function(){ openLb(img.src, img.alt); });
    fig.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openLb(img.src, img.alt); } });
  });

  // "View" buttons list one or more files separated by "|". A button stays hidden until at
  // least one of its files exists, and only the files that exist are shown, in the listed order.
  Array.prototype.forEach.call(document.querySelectorAll('[data-proof]'), function(btn){
    var files=btn.getAttribute('data-proof').split('|');
    var found=new Array(files.length);
    files.forEach(function(src, i){
      var probe=new Image();
      probe.onload=function(){ found[i]=src; btn.hidden=false; };
      probe.src=src;
    });
    btn.addEventListener('click', function(){
      var list=found.filter(Boolean);
      if(list.length) openLb(list, btn.getAttribute('data-proof-alt'));
    });
  });

  // Photos that only appear once their file exists (profile photo, gallery)
  Array.prototype.forEach.call(document.querySelectorAll('.opt-media'), function(fig){
    var img=fig.querySelector('img');
    function reveal(){ fig.hidden=false; }
    if(img.complete && img.naturalWidth) reveal(); else img.addEventListener('load', reveal);
    if(fig.classList.contains('g-item')){
      fig.addEventListener('click', function(){ openLb(img.src, img.alt); });
    }
  });

