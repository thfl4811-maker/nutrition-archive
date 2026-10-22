(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s,r){return (r||document).querySelector(s)};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* 업무 목록 티커 (아카이브 실제 업무명) */
  var ITEMS = [
    ['위생','위생관리지침 및 자료'],['위생','일일위생점검'],['위생','식단검토 및 검수'],['위생','CCP/CP 기록지'],['위생','CCP 및 CP 점검'],
    ['위생','위생·HACCP 교육'],['위생','위생교육 수료증'],['위생','건강진단결과서'],['위생','식중독 대책반'],['위생','위생점검표 및 운영평가표'],
    ['운영','우유'],['운영','식품비 사용비율 공개'],['운영','월별식단표'],['운영','학교운영위원회 심의자료'],['운영','영양 식생활 교육 계획서'],
    ['운영','급식소위원회'],['운영','알레르기 유발식품 표시제'],['운영','축산물등급표시제'],['운영','학교 누리집 게시판 운영'],['운영','학교급식 설문조사'],
    ['운영','소모품/비품 견적서'],['운영','학교급식 운영계획서'],['운영','급식모니터링'],['운영','식단사진'],['운영','시장조사/현품설명서'],
    ['운영','표준레시피'],['운영','급식비 정산 내역'],['운영','원산지 및 영양량 표시제'],['운영','시설개선비'],['운영','추가경정예산서'],
    ['교육','음식물쓰레기 감량 교육'],['교육','당·나트륨 저감 교육'],['교육','학부모·교직원 교육'],['교육','학생자치 연계 활동'],['교육','영양·식생활 교육자료'],
    ['교육','영양상담'],['교육','정규 교육과정']
  ];
  var cls = {'운영':'op','위생':'hy','교육':'ed'};
  var ol = $('#ticker');
  if (ol){
    var html = '';
    for (var k=0;k<2;k++) ITEMS.forEach(function(it,i){
      html += '<li'+(k?' aria-hidden="true"':'')+'><small>'+String(i+1).padStart(2,'0')+'</small>'+it[1]+'<i class="'+cls[it[0]]+'">'+it[0]+'</i></li>';
    });
    ol.innerHTML = html;
  }

  /* 글자 쪼개기 */
  function split(el){
    $$('.w', el).concat(el.classList.contains('split') ? [el] : []).forEach(function(w){
      var t = w.textContent; w.textContent = '';
      Array.prototype.forEach.call(t, function(c){
        var s = document.createElement('span'); s.className = 'ch'; s.setAttribute('aria-hidden','true');
        s.textContent = c === ' ' ? ' ' : c; w.appendChild(s);
      });
    });
  }
  $$('.scatter, .split').forEach(split);

  var nav = $('#nav'), totop = $('#totop');
  totop.addEventListener('click', function(){ if (window.__lenis) window.__lenis.scrollTo(0); else window.scrollTo({top:0,behavior:'smooth'}); });

  /* 숫자 세기 */
  function countUp(el){
    var to = +el.dataset.count, t0 = null;
    function step(ts){ if(!t0) t0 = ts; var p = Math.min(1,(ts-t0)/1400); el.textContent = Math.round(to*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }

  if (reduce || !window.gsap || !window.ScrollTrigger){
    nav.classList.add('on'); totop.classList.add('on');
    $$('[data-count]').forEach(function(el){ el.textContent = el.dataset.count; });
    var still = $('.tray-still'); if (still) still.style.zIndex = 1;
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* 부드러운 스크롤 */
  if (window.Lenis){
    var lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(t){ lenis.raf(t*1000); });
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){ var id = a.getAttribute('href'); if (id.length>1 && $(id)){ e.preventDefault(); lenis.scrollTo($(id), {offset:0}); } });
    });
  }

  /* ── 1. 인트로: 식판 창이 화면을 채우고 영상이 스크롤에 맞춰 재생 ── */
  var video = $('#dive'), target = 0, shown = 0, seeking = false;
  if (video){
    video.pause();
    video.addEventListener('seeked', function(){ seeking = false; });
    /* 영상을 통째로 받아 두면 어떤 서버에서도 앞뒤로 자유롭게 감을 수 있어요 */
    function toBlob(){
      var src = video.currentSrc;
      if (!src || src.indexOf('blob:') === 0 || !window.fetch) return;
      fetch(src).then(function(r){ return r.ok ? r.blob() : null; }).then(function(b){
        if (!b) return; var at = video.currentTime;
        video.addEventListener('loadedmetadata', function(){ seeking = false; video.currentTime = at; }, { once:true });
        video.src = URL.createObjectURL(b); video.load();
      }).catch(function(){});
    }
    if (video.readyState >= 1) toBlob(); else video.addEventListener('loadedmetadata', toBlob, { once:true });
    (function loop(){
      if (video.readyState >= 1 && isFinite(video.duration)){
        shown += (target - shown) * 0.18;
        var t = shown * (video.duration - 0.05);
        if (!seeking && Math.abs(video.currentTime - t) > 0.03){ seeking = true; video.currentTime = t; }
      }
      requestAnimationFrame(loop);
    })();
  }
  var clamp = function(v){ return Math.max(0, Math.min(1, v)); };

  var tray = $('#tray');
  var tl = gsap.timeline({
    defaults:{ ease:'none' },
    scrollTrigger:{ trigger:'#intro', start:'top top', end:'bottom bottom', scrub:true,
      onUpdate:function(self){ target = clamp((self.progress - 0.08) / 0.72); } }
  });
  tl.to('.intro-brand', { opacity:0, y:-60, duration:.12 }, 0)
    .to('.chev', { opacity:0, duration:.06 }, 0)
    .set(tray, { aspectRatio:'auto', height: function(){ return tray.offsetHeight; } }, 0)
    .to(tray, { width:'100vw', height:'100vh', top:'50%', duration:.4, ease:'power1.inOut' }, .04)
    .to('.tray-window', { borderRadius:0, boxShadow:'0 0 0 0 rgba(0,0,0,0)', duration:.4, ease:'power1.inOut' }, .04)
    .to('.tray-handle', { opacity:0, duration:.1 }, .1)
    .to('.intro-giant', { opacity:1, y:0, duration:.14 }, .7)
    .to('.tray-window video', { filter:'brightness(.55)', duration:.14 }, .74)
    .to('.intro-giant', { opacity:.15, duration:.08 }, .9)
    .to('.intro-fade', { opacity:1, duration:.1 }, .9);

  /* 상단 메뉴 · 맨 위로 */
  ScrollTrigger.create({ trigger:'#main', start:'top 70%', onEnter:function(){ nav.classList.add('on'); totop.classList.add('on'); },
    onLeaveBack:function(){ nav.classList.remove('on'); totop.classList.remove('on'); } });

  /* ── 2. 히어로 ── */
  gsap.from('.hero-title .ln>span', { yPercent:110, duration:1.1, ease:'power4.out', stagger:.12,
    scrollTrigger:{ trigger:'.hero', start:'top 75%' } });
  gsap.from('.hero-sub p, .hero-right', { y:24, opacity:0, duration:.9, stagger:.1, ease:'power2.out',
    scrollTrigger:{ trigger:'.hero', start:'top 60%' } });
  gsap.fromTo('.hero-trio', { y:120, scale:.9, rotate:-3 }, { y:-60, scale:1.04, rotate:2, ease:'none',
    scrollTrigger:{ trigger:'.hero', start:'top bottom', end:'bottom top', scrub:true } });
  gsap.to('.glow', { scale:1.25, opacity:.75, duration:4, yoyo:true, repeat:-1, ease:'sine.inOut', stagger:.8 });

  /* ── 3. 공감 카드 ── */
  $$('.ecard').forEach(function(card){
    gsap.from($$('.ecard-copy p', card), { y:28, opacity:0, duration:.8, stagger:.18, ease:'power2.out',
      scrollTrigger:{ trigger:card, start:'top 70%' } });
    if ($('img', card)) gsap.fromTo($('img', card), { scale:1.18 }, { scale:1, ease:'none',
      scrollTrigger:{ trigger:card, start:'top bottom', end:'bottom top', scrub:true } });
  });

  gsap.from('.fchip', { y:function(){ return gsap.utils.random(-260,-120); }, opacity:0, duration:1.2, stagger:.06, ease:'power3.out',
    scrollTrigger:{ trigger:'.ecard.mess', start:'top 75%' } });

  /* ── 4. 슬로건 + 벽 ── */
  gsap.from('.slogan-title, .slogan-brand, .slogan-sub', { y:30, opacity:0, duration:.9, stagger:.15, ease:'power2.out',
    scrollTrigger:{ trigger:'.slogan', start:'top 75%' } });
  gsap.fromTo('#wall', { xPercent:-40 }, { xPercent:-62, ease:'none',
    scrollTrigger:{ trigger:'.wall-wrap', start:'top bottom', end:'bottom top', scrub:true } });

  /* ── 5. Why: 흩어진 글자가 모이기 ── */
  $$('.scatter').forEach(function(h){
    var chars = $$('.ch', h);
    gsap.fromTo(chars, {
      x:function(){ return gsap.utils.random(-260,260); }, y:function(){ return gsap.utils.random(-160,160); },
      rotate:function(){ return gsap.utils.random(-120,120); }, opacity:0, scale:function(){ return gsap.utils.random(.4,1.8); }
    }, { x:0, y:0, rotate:0, opacity:1, scale:1, ease:'power2.out', stagger:{ each:.02, from:'random' },
      scrollTrigger:{ trigger:h, start:'top 95%', end:'top 45%', scrub:1 } });
  });
  gsap.from('.why-copy, .numbers-head p', { y:30, opacity:0, duration:.9, ease:'power2.out',
    scrollTrigger:{ trigger:'.why-copy', start:'top 80%' } });
  gsap.from('.b', { y:60, opacity:0, duration:.9, stagger:.12, ease:'power3.out',
    scrollTrigger:{ trigger:'.bento', start:'top 80%' } });

  /* ── 6. 숫자 ── */
  $$('[data-count]').forEach(function(el){
    ScrollTrigger.create({ trigger:el, start:'top 85%', once:true, onEnter:function(){ countUp(el); } });
  });

  /* ── 7. 마무리 ── */
  gsap.from('.cta-title', { y:40, opacity:0, duration:.9, ease:'power3.out',
    scrollTrigger:{ trigger:'.cta', start:'top 65%' } });
  gsap.from('.cta-sub', { y:20, opacity:0, duration:.8, delay:.3, scrollTrigger:{ trigger:'.cta', start:'top 65%' } });
  gsap.from('.finale-card', { y:80, rotate:-4, opacity:0, duration:1.1, ease:'power3.out',
    scrollTrigger:{ trigger:'.finale-card', start:'top 85%' } });
  gsap.from('.foot-giant span', { yPercent:60, opacity:0, duration:1, stagger:.15, ease:'power3.out',
    scrollTrigger:{ trigger:'.foot', start:'top 85%' } });

  window.addEventListener('load', function(){ ScrollTrigger.refresh(); });
})();
