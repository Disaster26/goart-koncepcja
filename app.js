(function(){
'use strict';
var d=document;
function $(s,c){return (c||d).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}

/* menu */
var bur=$('#burger'),nav=$('#nav');
if(bur&&nav){
 bur.addEventListener('click',function(){var o=nav.classList.toggle('otw');bur.setAttribute('aria-expanded',o);bur.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');d.body.classList.toggle('menu-otw',o)});
 $$('.pod-b',nav).forEach(function(b){b.addEventListener('click',function(){var p=b.nextElementSibling,o=p.classList.toggle('otw');b.setAttribute('aria-expanded',o)})});
 var akt=$('.pod a[aria-current]',nav);if(akt){var pp=akt.closest('.pod');pp.classList.add('otw');pp.previousElementSibling.setAttribute('aria-expanded','true')}
 d.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('otw'))bur.click()});
}

/* przeciąganie myszą dla przewijanych pasów */
function przeciagaj(el){
 var x0=0,s0=0,ruch=false,wcisk=false;
 el.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;wcisk=true;ruch=false;x0=e.clientX;s0=el.scrollLeft});
 window.addEventListener('pointermove',function(e){if(!wcisk)return;var dx=e.clientX-x0;if(Math.abs(dx)>5){ruch=true;el.classList.add('drag')}if(ruch){el.scrollLeft=s0-dx;e.preventDefault()}});
 window.addEventListener('pointerup',function(){if(!wcisk)return;wcisk=false;if(ruch){var w=el.firstElementChild?el.firstElementChild.getBoundingClientRect().width:el.clientWidth;el.classList.remove('drag');var gap=parseFloat(getComputedStyle(el).columnGap)||0;var i=Math.round(el.scrollLeft/(w+gap));el.scrollTo({left:i*(w+gap),behavior:'smooth'})}});
 el.addEventListener('click',function(e){if(ruch){e.preventDefault();e.stopPropagation();ruch=false}},true);
 el.addEventListener('dragstart',function(e){e.preventDefault()});
}
$$('[data-przewijane]').forEach(przeciagaj);

/* karuzele w kartach */
$$('[data-kar]').forEach(function(k){
 var tor=$('.kar-tor',k),n=tor.children.length,licz=$('.kar-licz b',k);
 przeciagaj(tor);
 function idx(){return Math.round(tor.scrollLeft/tor.clientWidth)}
 function idz(i){i=(i+n)%n;tor.scrollTo({left:i*tor.clientWidth,behavior:'smooth'})}
 $('.kar-prev',k).addEventListener('click',function(){idz(idx()-1)});
 $('.kar-next',k).addEventListener('click',function(){idz(idx()+1)});
 var t;tor.addEventListener('scroll',function(){clearTimeout(t);t=setTimeout(function(){if(licz)licz.textContent=idx()+1},60)},{passive:true});
 tor.setAttribute('tabindex','0');
 tor.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){idz(idx()+1);e.preventDefault()}if(e.key==='ArrowLeft'){idz(idx()-1);e.preventDefault()}});
});

/* hero */
var hero=$('#hero');
if(hero){
 var sl=$$('.sl',hero),cur=0,tm,T=$('#hplT'),D=$('#hplD'),H=$('#hplH'),pT=$('#hpT'),pN=$('#hpN');
 var red=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function pokaz(i){
  sl[cur].classList.remove('on');cur=(i+sl.length)%sl.length;var s=sl[cur];
  var im=$('img',s);if(im.loading==='lazy')im.loading='eager';
  s.classList.add('on');
  if(T){T.textContent=s.dataset.t;D.textContent=s.dataset.d;H.setAttribute('href',H.getAttribute('href').replace(/oferta\/[^\/]+\//,s.dataset.h))}
  if(pT){pT.textContent=s.dataset.t;pN.textContent=cur+1}
 }
 function auto(){clearInterval(tm);if(!red)tm=setInterval(function(){pokaz(cur+1)},6500)}
 var p=$('#slPrev'),nx=$('#slNext');
 if(p)p.addEventListener('click',function(){pokaz(cur-1);auto()});
 if(nx)nx.addEventListener('click',function(){pokaz(cur+1);auto()});
 var fx=0,fy=0,foto=$('.hero-foto',hero);
 foto.addEventListener('touchstart',function(e){fx=e.touches[0].clientX;fy=e.touches[0].clientY},{passive:true});
 foto.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-fx,dy=e.changedTouches[0].clientY-fy;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){pokaz(cur+(dx<0?1:-1));auto()}},{passive:true});
 window.addEventListener('load',function(){sl.forEach(function(s){var im=$('img',s);if(im.loading==='lazy')im.loading='eager'})});
 d.addEventListener('visibilitychange',function(){if(d.hidden)clearInterval(tm);else auto()});
 auto();
}

/* dolny pasek na telefonie */
var mob=$('#mob'),cel=$('#heroCta')||$('.ph .btn')||$('.ph h1');
if(mob&&cel&&'IntersectionObserver' in window){
 new IntersectionObserver(function(en){var r=en[0];mob.classList.toggle('widac',!r.isIntersecting&&r.boundingClientRect.top<0)}).observe(cel);
}

/* lightbox */
var lb=$('#lb');
if(lb){
 var lin=$$('[data-lb]'),li=0,lim=$('img',lb),ln=$('.lb-n',lb),ost;
 function otworz(i){li=(i+lin.length)%lin.length;var a=lin[li];lim.src=a.getAttribute('href');lim.alt=$('img',a).alt;ln.textContent=(li+1)+' / '+lin.length}
 lin.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();ost=a;otworz(i);lb.hidden=false;d.body.style.overflow='hidden';$('.lb-x',lb).focus()})});
 function zamknij(){lb.hidden=true;d.body.style.overflow='';if(ost)ost.focus()}
 $('.lb-x',lb).addEventListener('click',zamknij);
 $('.lb-prev',lb).addEventListener('click',function(){otworz(li-1)});
 $('.lb-next',lb).addEventListener('click',function(){otworz(li+1)});
 lb.addEventListener('click',function(e){if(e.target===lb)zamknij()});
 d.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')zamknij();if(e.key==='ArrowRight')otworz(li+1);if(e.key==='ArrowLeft')otworz(li-1)});
 var sx=0;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
 lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)otworz(li+(dx<0?1:-1))},{passive:true});
}

/* formularz pokazowy - bez wysyłki */
$$('form[data-demo]').forEach(function(f){
 f.addEventListener('submit',function(e){e.preventDefault();var i=$('.form-info',f);i.hidden=false});
});

/* cookies */
var ck=$('#cookies');
function bezMapy(){var f=$('.mapa iframe');if(f){var a=d.createElement('a');a.className='mapa-link';a.href='https://www.google.com/maps/search/?api=1&query=Micha%C5%82a+Elwiro+Andriollego+48%2F50%2C+05-400+Otwock';a.target='_blank';a.rel='noopener';a.textContent='Otwórz mapę dojazdu w Google Maps';f.parentNode.replaceChild(a,f)}}
if(ls('goart-cookies')==='min')bezMapy();
if(ck&&!ls('goart-cookies')){ck.hidden=false;$$('[data-cookies]',ck).forEach(function(b){b.addEventListener('click',function(){ls('goart-cookies',b.dataset.cookies);ck.hidden=true;if(b.dataset.cookies==='min')bezMapy()})})}
})();
