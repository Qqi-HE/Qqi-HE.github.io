// 语言切换、锚点滚动与动画；修改文字无需编辑本文件。
(()=>{const root=document.getElementById('qqi-site');const button=root.querySelector('.language');let language=document.documentElement.lang==='en'?'en':'cn';
function setLanguage(value){language=value;root.querySelectorAll('[data-lang]').forEach(el=>el.hidden=el.dataset.lang!==value);document.documentElement.lang=value==='cn'?'zh-CN':'en';button.textContent=value==='cn'?'English':'中文';button.setAttribute('aria-label',value==='cn'?'Switch to English':'切换到中文');document.title=value==='cn'?'何其锜 · 2027 · 音频与音乐算法':'Qqi He · 2027 · Audio & Music';}
button.addEventListener('click',()=>setLanguage(language==='cn'?'en':'cn'));setLanguage(language);
function revealNotes(){if(location.hash==='#notes')root.querySelector('#notes').open=true;}window.addEventListener('hashchange',revealNotes);revealNotes();

// Duration in milliseconds. Increase for slower scrolling.
const SCROLL_DURATION_MS = 1000;
let scrollFrame = 0;
const fixedTop=root.querySelector('.fixed-top');
function updateTopHeight(){root.style.setProperty('--fixed-top-height',fixedTop.getBoundingClientRect().height+'px');}
updateTopHeight();
if('ResizeObserver' in window)new ResizeObserver(updateTopHeight).observe(fixedTop);

function cancelScroll(){cancelAnimationFrame(scrollFrame);scrollFrame=0;}
function scrollToSection(target){
 cancelScroll();
 const start=window.scrollY;
 const margin=root.querySelector('.fixed-top').getBoundingClientRect().height+24;
 const maxScroll=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
 const end=Math.min(maxScroll,Math.max(0,start+target.getBoundingClientRect().top-margin));
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){window.scrollTo({top:end,behavior:'instant'});return;}
 const distance=end-start;
 const duration=Math.min(SCROLL_DURATION_MS,Math.max(450,Math.abs(distance)*0.6));
 let started;
 function step(now){
  if(started===undefined)started=now;
  const t=Math.min(1,(now-started)/duration);
  const eased=1-Math.pow(1-t,3);
  window.scrollTo({top:start+distance*eased,behavior:'instant'});
  if(t<1)scrollFrame=requestAnimationFrame(step);else scrollFrame=0;
 }
 scrollFrame=requestAnimationFrame(step);
}
root.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',event=>{
 if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 const target=document.getElementById(a.hash.slice(1));if(!target)return;
 event.preventDefault();
 if(location.hash!==a.hash)history.pushState(null,'',a.hash);
 scrollToSection(target);
}));
window.addEventListener('wheel',cancelScroll,{passive:true});
window.addEventListener('touchstart',cancelScroll,{passive:true});
window.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))cancelScroll();});
window.addEventListener('popstate',cancelScroll);
if(location.hash){requestAnimationFrame(()=>{const target=document.getElementById(location.hash.slice(1));if(target){const top=window.scrollY+target.getBoundingClientRect().top-fixedTop.getBoundingClientRect().height-24;window.scrollTo({top:Math.max(0,top),behavior:'instant'});}});}

root.querySelectorAll('a[href^="http"]').forEach(a=>{a.target='_blank';a.rel='noopener noreferrer';});
})();
