/* 영양아카이브 공통 상단 메뉴
   모든 페이지에서 똑같이 쓰는 메뉴입니다. 메뉴를 고칠 때는 이 파일만 바꾸면 됩니다.

   쓰는 법: 페이지에 아래 두 줄을 넣어요.
     <header id="siteNav" data-theme="dark|light|auto" data-active="home|guide|arc|chk|cal"></header>
     <script src="nav.js"></script>
   자료실 페이지는 SiteNav.onNav(fn)으로 메뉴 클릭을 받아 페이지를 다시 열지 않고 화면만 바꿉니다. */
(function(){
  var el = document.getElementById('siteNav');
  if (!el) return;

  var CATS = [['운영','op','쌀이'],['위생','hy','찬이'],['교육','ed','꾹이']];
  var ARC = 'archive-preview.html';
  var MARK = '<svg class="sn-mark" viewBox="0 0 44 32" aria-hidden="true"><defs><linearGradient id="snS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3f5f7"/><stop offset="1" stop-color="#a3abb3"/></linearGradient><linearGradient id="snC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa2aa"/><stop offset="1" stop-color="#d9dde1"/></linearGradient></defs><rect x="1" y="1" width="42" height="30" rx="7" fill="url(#snS)" stroke="#8a929a" stroke-width="1"/><g fill="url(#snC)" stroke="#8a929a" stroke-width=".8"><rect x="5" y="4.5" width="10" height="8" rx="2.5"/><rect x="17" y="4.5" width="10" height="8" rx="2.5"/><rect x="29" y="4.5" width="10" height="8" rx="2.5"/><rect x="5" y="15" width="16" height="12.5" rx="3"/><rect x="23" y="15" width="16" height="12.5" rx="3"/></g><circle cx="10" cy="8.5" r="2.2" fill="#f2a24a"/><circle cx="22" cy="8.5" r="2.2" fill="#4d7fe8"/><circle cx="34" cy="8.5" r="2.2" fill="#4fae6a"/></svg>';

  var CSS = ''
  /* 색: 첫 화면은 어두운 바탕, 나머지는 밝은 바탕. 배치는 같고 색만 다릅니다. */
  + '#siteNav{--sn-bg:rgba(246,242,234,.94);--sn-fg:#1d232b;--sn-mute:#5b6470;--sn-line:#e7e0d3;--sn-track:#ece6da;--sn-on-bg:#1d232b;--sn-on-fg:#fff;--sn-drop:#fffdf8;--sn-soon:#b5651d;--sn-soon-bg:#fff1de;--sn-soon-line:#f1cf9f;'
  + 'position:sticky;top:0;left:0;right:0;z-index:60;background:var(--sn-bg);color:var(--sn-fg);border-bottom:1px solid var(--sn-line);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);'
  + 'font-family:"Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif;padding-top:env(safe-area-inset-top,0px)}'
  + '#siteNav[data-theme=dark]{--sn-bg:rgba(7,8,10,.78);--sn-fg:#f6f1e6;--sn-mute:#b9bfc8;--sn-line:rgba(255,255,255,.08);--sn-track:rgba(255,255,255,.07);--sn-on-bg:#f6f1e6;--sn-on-fg:#07080a;--sn-drop:#15181d;--sn-soon:#f2b46a;--sn-soon-bg:rgba(242,162,74,.14);--sn-soon-line:rgba(242,162,74,.4);position:fixed}'
  + '@media (prefers-color-scheme:dark){#siteNav[data-theme=auto]{--sn-bg:rgba(21,25,29,.92);--sn-fg:#e7e9ea;--sn-mute:#9aa4ab;--sn-line:#333b42;--sn-track:#232a30;--sn-on-bg:#e7e9ea;--sn-on-fg:#15191d;--sn-drop:#1d2227;--sn-soon:#f0965f;--sn-soon-bg:#3e2a1d;--sn-soon-line:#6b4a32}}'
  + '#siteNav *{box-sizing:border-box}#siteNav a{color:inherit;text-decoration:none}'
  + '.sn-in{max-width:1440px;margin:0 auto;height:64px;display:flex;align-items:center;gap:20px;padding:0 max(32px,env(safe-area-inset-right,0px)) 0 max(32px,env(safe-area-inset-left,0px))}'
  + '.sn-logo{display:flex;align-items:center;gap:10px;margin-right:auto;flex:none}'
  + '.sn-mark{width:40px;height:29px;flex:none}'
  + '.sn-logo b{font-family:"Unbounded","Noto Sans KR",sans-serif;font-weight:800;font-size:15px;letter-spacing:.03em;white-space:nowrap}'
  + '.sn-menu{display:flex;align-items:center;gap:4px;background:var(--sn-track);padding:5px;border-radius:999px}'
  + '.sn-menu>a,.sn-dd>a{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:999px;font-weight:700;font-size:14.5px;color:var(--sn-mute);white-space:nowrap;transition:background .2s,color .2s}'
  + '.sn-menu>a:hover,.sn-dd>a:hover{color:var(--sn-fg)}'
  + '#siteNav .sn-on{background:var(--sn-on-bg);color:var(--sn-on-fg)}'
  + '.sn-soon{font-style:normal;font-size:10.5px;font-weight:700;color:var(--sn-soon);background:var(--sn-soon-bg);border:1px solid var(--sn-soon-line);border-radius:999px;padding:0 6px;line-height:1.6}'
  + '.sn-caret{width:7px;height:7px;border-right:1.6px solid currentColor;border-bottom:1.6px solid currentColor;transform:translateY(-2px) rotate(45deg);opacity:.6}'
  + '.sn-dd{position:relative}'
  + '.sn-drop{position:absolute;left:0;right:0;top:calc(100% + 6px);transform:translateY(-4px);padding:5px;border-radius:14px;background:var(--sn-drop);border:1px solid var(--sn-line);box-shadow:0 18px 40px -14px rgba(0,0,0,.35);opacity:0;visibility:hidden;transition:opacity .18s,transform .18s,visibility .18s}'
  + '.sn-drop::before{content:"";position:absolute;left:0;right:0;top:-8px;height:8px}'
  + '.sn-dd:hover .sn-drop,.sn-dd:focus-within .sn-drop{opacity:1;visibility:visible;transform:none}'
  + '.sn-drop a{display:flex;align-items:center;justify-content:center;gap:6px;padding:7px 4px;border-radius:999px;font-weight:700;font-size:14px;white-space:nowrap}'
  + '.sn-drop a:hover{background:var(--sn-track)}'
  + '.sn-drop small{display:none}'
  + '.sn-dot{width:9px;height:9px;border-radius:50%;flex:none}.sn-dot.op{background:#e48a2c}.sn-dot.hy{background:#3d6fd8}.sn-dot.ed{background:#3b9a5b}'
  /* 자료실 아래 운영·위생·교육 탭 */
  + '.sn-sub{border-top:1px solid var(--sn-line)}.sn-sub[hidden]{display:none}'
  + '.sn-sub-in{max-width:1440px;margin:0 auto;display:flex;align-items:center;gap:8px;padding:8px max(32px,env(safe-area-inset-right,0px)) 8px max(32px,env(safe-area-inset-left,0px));overflow-x:auto;scrollbar-width:none}'
  + '.sn-sub-in::-webkit-scrollbar{display:none}'
  + '.sn-sub-in>b{font-size:12.5px;font-weight:700;color:var(--sn-mute);margin-right:4px;white-space:nowrap}'
  + '.sn-sub a{display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:999px;border:1px solid var(--sn-line);font-weight:700;font-size:14px;white-space:nowrap;background:transparent}'
  + '.sn-sub a small{font-weight:500;font-size:12px;color:var(--sn-mute)}'
  + '#siteNav .sn-sub a.op.sn-on{background:#e48a2c;border-color:#e48a2c;color:#fff}#siteNav .sn-sub a.hy.sn-on{background:#3d6fd8;border-color:#3d6fd8;color:#fff}#siteNav .sn-sub a.ed.sn-on{background:#3b9a5b;border-color:#3b9a5b;color:#fff}'
  + '#siteNav .sn-sub a.sn-on small,#siteNav .sn-sub a.sn-on .sn-dot{color:rgba(255,255,255,.85);background-color:rgba(255,255,255,.85)}#siteNav .sn-sub a.sn-on small{background:none}'
  /* 좁은 화면: 메뉴를 로고 아래 한 줄로, 옆으로 밀어서 봅니다 */
  + '@media (max-width:860px){.sn-in{height:auto;flex-wrap:wrap;row-gap:8px;padding-top:10px;padding-bottom:10px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}'
  + '.sn-menu{order:3;width:100%;overflow-x:auto;scrollbar-width:none;justify-content:flex-start}.sn-menu::-webkit-scrollbar{display:none}'
  + '.sn-menu>a,.sn-dd>a{padding:7px 13px;font-size:14px}.sn-drop,.sn-caret{display:none}'
  + '.sn-sub-in{padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}}'
  + '.sn-s{display:none}'
  + '@media (max-width:560px){.sn-menu{justify-content:space-between}.sn-menu>a,.sn-dd>a{padding:7px 10px;font-size:13.5px;gap:4px}.sn-l{display:none}.sn-s{display:inline}}'
  + '@media (max-width:420px){.sn-logo b{font-size:13px}.sn-mark{width:34px;height:25px}}'
  + '@media (max-width:350px){.sn-menu>a,.sn-dd>a{padding:6px 7px;font-size:12.5px}}'
  + '@media (prefers-reduced-motion:reduce){#siteNav *{transition:none!important}}';

  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  if (!document.querySelector('link[href*="Unbounded"]')){
    var lk = document.createElement('link'); lk.rel = 'stylesheet';
    lk.href = 'https://fonts.googleapis.com/css2?family=Unbounded:wght@800&display=swap';
    document.head.appendChild(lk);
  }

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  var catUrl = function(c){ return ARC + '?category=' + encodeURIComponent(c); };

  el.setAttribute('aria-label', '사이트 메뉴');
  el.innerHTML =
    '<div class="sn-in">'
    + '<a class="sn-logo" href="index.html" aria-label="영양아카이브 첫 화면">' + MARK + '<b>NUTRITION ARCHIVE</b></a>'
    + '<nav class="sn-menu" aria-label="메인 메뉴">'
    +   '<a data-k="guide" href="guide.html">이용안내</a>'
    +   '<div class="sn-dd"><a data-k="arc" href="' + ARC + '">자료실 <i class="sn-caret" aria-hidden="true"></i></a>'
    +     '<div class="sn-drop" role="group" aria-label="자료실 분류">'
    +       CATS.map(function(c){ return '<a data-k="arc" data-c="' + c[0] + '" href="' + esc(catUrl(c[0])) + '"><i class="sn-dot ' + c[1] + '"></i>' + c[0] + '<small>' + c[2] + '</small></a>'; }).join('')
    +     '</div></div>'
    +   '<a data-k="chk" href="' + ARC + '?tab=chk">점검표</a>'
    +   '<a data-k="cal" href="' + ARC + '?tab=cal">급식달력 <em class="sn-soon"><span class="sn-l">2027 공개 예정</span><span class="sn-s" aria-hidden="true">2027</span></em></a>'
    + '</nav>'
    + '</div>'
    + '<div class="sn-sub" hidden><div class="sn-sub-in"><b>자료실</b>'
    +   CATS.map(function(c){ return '<a class="' + c[1] + '" data-k="arc" data-c="' + c[0] + '" href="' + esc(catUrl(c[0])) + '"><i class="sn-dot ' + c[1] + '"></i>' + c[0] + '<small>' + c[2] + '</small></a>'; }).join('')
    + '</div></div>';

  var handlers = [];
  var api = {
    el: el,
    setActive: function(k){
      el.dataset.active = k || '';
      Array.prototype.forEach.call(el.querySelectorAll('.sn-menu>a,.sn-dd>a'), function(a){
        var on = a.dataset.k === k; a.classList.toggle('sn-on', on);
        if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
    },
    setSub: function(c){
      Array.prototype.forEach.call(el.querySelectorAll('.sn-sub a'), function(a){ a.classList.toggle('sn-on', a.dataset.c === c); });
    },
    showSub: function(on){ el.querySelector('.sn-sub').hidden = !on; },
    onNav: function(fn){ handlers.push(fn); },
    height: function(){ return el.offsetHeight; }
  };
  window.SiteNav = api;
  api.setActive(el.dataset.active);
  if (el.dataset.sub) { api.showSub(true); api.setSub(el.dataset.sub); }

  /* 자료실처럼 한 페이지 안에서 화면만 바꾸는 곳은 클릭을 넘겨받아 처리해요 */
  el.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[data-k]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
    for (var i = 0; i < handlers.length; i++){
      if (handlers[i](a.dataset.k, a.dataset.c || null) === true){ e.preventDefault(); return; }
    }
  });

  /* 메뉴 높이를 CSS 변수로 알려 줘서, 다른 고정 요소가 메뉴 아래에 붙을 수 있게 해요 */
  function syncH(){ document.documentElement.style.setProperty('--sn-h', el.offsetHeight + 'px'); }
  syncH(); window.addEventListener('resize', syncH);
  if (window.ResizeObserver) new ResizeObserver(syncH).observe(el);
})();
