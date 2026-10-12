'use strict';
const $=(s,r=document)=>r.querySelector(s),el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const FAM={cosmic:'Cosmic entity',celestial:'Celestial object',geometric:'Geometric design',creature:'Creature',robot:'Robot',symbol:'Minimalist symbol'};
const SHAPES={circle:'circle(50%)',square:'inset(0)',rounded:'inset(0 round 24%)',hexagon:'polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%)',diamond:'polygon(50% 0,100% 50%,50% 100%,0 50%)'};
const MAXLEN=5000; // input-length safety cap (digits); not a profile-number limit
/* ---------- storage ---------- */
const LS={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}}};
const DEF={vid:true,shade:45,depth:60,calm:false,size:'m',shape:'circle',fam:'auto',hc:false};
let S={...DEF,...LS.get('sbu_s',{})},hist=LS.get('sbu_h',[]),recent=LS.get('sbu_r',[]),favs=LS.get('sbu_f',[]),edits=LS.get('sbu_e',{});
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),1800)};
const copy=async(t,m)=>{try{await navigator.clipboard.writeText(t);toast(m)}catch{toast('Copy blocked by the browser. Select the text and copy it manually.')}};
/* ---------- ids (decimal strings + BigInt only) ---------- */
function parseId(raw){const s=String(raw).trim();if(!s)return{e:'Enter a profile ID.'};if(s[0]==='-')return{e:'Profile IDs cannot be negative.'};if(/[.,eE]/.test(s)&&/^\d/.test(s))return{e:'Profile IDs are whole numbers. Remove decimals or exponents.'};if(!/^\d+$/.test(s))return{e:'Use digits 0–9 only.'};if(s.length>MAXLEN)return{e:`Input exceeds the ${MAXLEN}-digit safety cap of this browser app.`};const id=s.replace(/^0+(?=\d)/,'');return{id,note:id!==s?'Leading zeros removed; the canonical ID is shown.':''}}
/* ---------- deterministic generator: cost depends on digit count, never on numeric value ---------- */
function hash(str){let a=1779033703,b=3144134277,c=1013904242,d=2773480762;for(let i=0;i<str.length;i++){const k=str.charCodeAt(i);a=b^Math.imul(a^k,597399067);b=c^Math.imul(b^k,2869860233);c=d^Math.imul(c^k,951274213);d=a^Math.imul(d^k,2716044179)}a=Math.imul(c^a>>>18,597399067);b=Math.imul(d^b>>>22,2869860233);return[a>>>0,b>>>0,Math.imul(a^b,c)>>>0,Math.imul(d^c,a)>>>0]}
function rng(seed){let[a,b,c,d]=seed;return()=>{a|=0;b|=0;c|=0;d|=0;const t=(a+b|0)+d|0;d=d+1|0;a=b^b>>>9;b=c+(c<<3)|0;c=c<<21|c>>>11;c=c+t|0;return(t>>>0)/4294967296}}
const P1='Ael Vor Zen Kar Lum Syl Oth Ner Ixa Qui Mor Thal Eri Dru Sol Vey Ash Nym Cae Ruu'.split(' '),P2='ra tho vael mir dyn seth lune kos rin phe gar ul nox ea'.split(' '),P3='is on a ex yr um ae'.split(' ');
const DESC=['Drifts between signals nobody listens for.','Keeps the record of a place that was never named.','Appears only where the light is thin.','Remembers every silence it has crossed.','Carries a sound older than the first star.','Waits at the edge of the archive.'];
const cache=new Map();
function gen(id){let p=cache.get(id);if(p)return p;const h=hash(id),r=rng(h),pick=a=>a[Math.floor(r()*a.length)],fk=Object.keys(FAM);
 p={id,seed:h,fam:fk[Math.floor(r()*fk.length)],hue:Math.floor(r()*360),name:pick(P1)+pick(P2)+(r()<.5?pick(P3):''),desc:pick(DESC),status:'Generated',sym:'◐◒◓◑✦✧⌖⌬⍟'[Math.floor(r()*9)]};
 p.name+=' '+pick(P1);if(cache.size>2000)cache.clear();cache.set(id,p);return p}
const view=id=>{const g={...gen(id)},e=edits[id];if(S.fam!=='auto')g.fam=S.fam;return e?{...g,...e.meta,status:'Saved locally',edit:e}:g};
/* ---------- avatar svg ---------- */
function art(seed,fam,hue){const r=rng(seed),H=(o,s=10,l=70)=>`hsl(${(hue+o)%360} ${s}% ${l}%)`,A=H(0,26,78),B=H(40,18,50),n=(a,b)=>a+r()*(b-a);let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="g"><stop offset="0" stop-color="${H(0,22,34)}"/><stop offset="1" stop-color="#05060a"/></radialGradient></defs><rect width="100" height="100" fill="url(#g)"/>`;
 if(fam==='cosmic'){for(let i=0;i<4;i++)s+=`<circle cx="${n(25,75)}" cy="${n(25,75)}" r="${n(14,30)}" fill="${H(i*50,30,55)}" opacity=".16"/>`;for(let i=0;i<26;i++)s+=`<circle cx="${n(2,98)}" cy="${n(2,98)}" r="${n(.3,1.2)}" fill="#fff" opacity="${n(.3,1)}"/>`;s+=`<circle cx="50" cy="50" r="${n(8,15)}" fill="#05060a" stroke="${A}" stroke-width=".8"/>`}
 else if(fam==='celestial'){const c=n(10,20);s+=`<circle cx="50" cy="50" r="${c}" fill="${B}"/>`;for(let i=0;i<3;i++)s+=`<ellipse cx="50" cy="50" rx="${c+n(10,30)}" ry="${n(4,14)}" fill="none" stroke="${A}" stroke-width="${n(.4,1.4)}" transform="rotate(${n(-60,60)} 50 50)" opacity=".8"/>`;s+=`<circle cx="${n(70,90)}" cy="${n(10,30)}" r="${n(2,5)}" fill="${A}"/>`}
 else if(fam==='geometric'){const k=3+Math.floor(r()*5);for(let j=0;j<4;j++){let d='';for(let i=0;i<k;i++){const a=i/k*6.283+j*.4,R=44-j*9;d+=`${i?'L':'M'}${50+Math.cos(a)*R} ${50+Math.sin(a)*R}`}s+=`<path d="${d}Z" fill="${j%2?'none':H(j*30,20,40)}" stroke="${A}" stroke-width=".8" opacity=".85"/>`}}
 else if(fam==='creature'){s+=`<path d="M18 80Q50 ${n(0,25)} 82 80Z" fill="${B}"/>`;const e=1+Math.floor(r()*3);for(let i=0;i<e;i++){const x=e===1?50:30+i*(40/(e-1)),y=n(42,56);s+=`<ellipse cx="${x}" cy="${y}" rx="${n(6,10)}" ry="${n(3,8)}" fill="#05060a" stroke="${A}" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="2" fill="${A}"/>`}s+=`<path d="M30 ${n(20,32)}L40 40M70 ${n(20,32)}L60 40" stroke="${A}" stroke-width="1.2" fill="none"/>`}
 else if(fam==='robot'){s+=`<rect x="24" y="26" width="52" height="48" rx="${n(2,14)}" fill="${H(0,10,24)}" stroke="${A}" stroke-width="1"/><rect x="33" y="${n(38,44)}" width="34" height="9" rx="4" fill="#05060a" stroke="${H(60,60,70)}" stroke-width=".8"/><circle cx="${n(38,62)}" cy="46" r="2.4" fill="${H(60,70,75)}"/>`;for(let i=0;i<4;i++)s+=`<path d="M34 ${60+i*3}h${n(10,32)}" stroke="${B}" stroke-width="1"/>`;s+=`<path d="M50 26V14" stroke="${A}"/><circle cx="50" cy="12" r="2.4" fill="${A}"/>`}
 else s+=`<circle cx="50" cy="50" r="${n(26,36)}" fill="none" stroke="${A}" stroke-width="1"/><path d="M${n(30,45)} ${n(30,45)}L${n(55,70)} ${n(40,60)}L${n(35,60)} ${n(62,75)}" fill="none" stroke="${A}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
 return s+'</svg>'}
function avatar(p,size,o={}){const e=p.edit||{},v={fam:p.fam,shape:S.shape,bw:2,bc:'#dfe5f0',glow:0,zoom:1,rot:0,flip:false,br:100,ct:100,sa:100,hu:0,gray:0,...e.look,...o},w=el('span','av');
 w.style.cssText=`--clip:${SHAPES[v.shape]};width:${size}px;height:${size}px;filter:drop-shadow(0 0 ${v.glow}px ${v.bc})`;
 const b=el('span','avb');b.style.cssText=`padding:${v.bw}px;background:${v.bc};width:${size}px;height:${size}px`;const i=el('span','avi');i.style.cssText=`width:100%;height:100%;background:#05060a`;
 const fl=`brightness(${v.br}%) contrast(${v.ct}%) saturate(${v.sa}%) hue-rotate(${v.hu}deg) grayscale(${v.gray}%)`,tf=`scale(${v.zoom}) rotate(${v.rot}deg) scaleX(${v.flip?-1:1})`;
 if(v.img&&!o.noimg||o.img){const im=new Image();im.alt='';im.decoding='async';im.src=o.img||v.img;im.style.cssText=`filter:${fl};transform:${tf}`;i.append(im)}
 else{const d=el('span');d.style.cssText=`filter:${fl};transform:${tf}`;d.innerHTML=art(p.seed,v.fam,p.hue);i.append(d)}
 b.append(i);w.append(b);return w}
/* ---------- state helpers ---------- */
const save=()=>{LS.set('sbu_s',S);LS.set('sbu_h',hist);LS.set('sbu_r',recent);LS.set('sbu_f',favs)};
const bump=(a,id,n)=>{const i=a.indexOf(id);if(i>=0)a.splice(i,1);a.unshift(id);a.length=Math.min(a.length,n)};
function applyS(){const d=document.body,v=$('#vid'),reduce=S.calm||matchMedia('(prefers-reduced-motion:reduce)').matches;d.classList.toggle('calm',S.calm);d.classList.toggle('hc',S.hc);document.documentElement.style.setProperty('--sh',S.shade/100);document.documentElement.style.setProperty('--dp',S.depth/100);
 if(S.vid&&!reduce){v.hidden=false;v.play().catch(()=>{v.hidden=true})}else{v.pause();v.hidden=true}save()}
$('#vid').addEventListener('error',()=>{$('#vid').hidden=true},true);
/* ---------- routing ---------- */
const app=$('#app');
function route(){const h=location.hash.slice(1)||'/',m=h.match(/^\/profile\/(.*)$/);app.replaceChildren();scrollTo(0,0);unvirt();
 if(m){const q=parseId(decodeURIComponent(m[1]));return q.e?home(q.e):profile(q.id)}
 if(h==='/explore')return explore();if(h==='/favorites')return saved();home()}
addEventListener('hashchange',route);
const go=id=>{location.hash='#/profile/'+id};
function goSearch(raw,errEl){const q=parseId(raw);if(q.e){errEl.textContent=q.e;return}errEl.textContent='';bump(hist,q.id,12);save();if(q.note)toast(q.note);if(location.hash==='#/profile/'+q.id)route();else go(q.id)}
function chipList(label,arr,box){if(!arr.length)return;box.append(el('p','fine',label));const c=el('div','chips');arr.slice(0,8).forEach(id=>{const a=el('a','chip',id);a.href='#/profile/'+id;a.title=id;c.append(a)});box.append(c)}
/* ---------- home / infinite research ---------- */
function home(err=''){const s=el('section','hero');s.append(el('h1','','The Silence Beyond the Universe'),el('p','lede','An archive with no last page. Every whole number is an identity. Enter any ID and it is generated from the digits themselves, never looked up in a list.'));
 const pn=el('div','panel'),f=el('div','rs'),i=el('input');i.type='text';i.inputMode='numeric';i.autocomplete='off';i.spellcheck=false;i.placeholder='Any whole number, e.g. 123456789012345678901234567890';i.setAttribute('aria-label','Profile ID');
 const e=el('p','err',err);e.setAttribute('role','alert');const go1=el('button','pri','Research ID'),rnd=el('button','line','Random'),clr=el('button','ghost','Clear');
 go1.onclick=()=>goSearch(i.value,e);i.onkeydown=k=>{if(k.key==='Enter')go1.click()};clr.onclick=()=>{i.value='';e.textContent='';i.focus()};
 rnd.onclick=()=>{const r=crypto.getRandomValues(new Uint32Array(4));go(BigInt('0x'+[...r].map(x=>x.toString(16).padStart(8,'0')).join('')).toString())};
 f.append(i,go1,rnd,clr);pn.append(f,e,el('p','fine','Generated identities are virtual and reproducible. Only profiles you edit and save become saved profiles, stored in this browser.'));chipList('Search history',hist,pn);chipList('Recently opened',recent,pn);s.append(pn);app.append(s)}
/* ---------- profile ---------- */
function profile(id){bump(recent,id,12);save();const p=view(id),w=el('section','prof'),L=el('div','panel prev'),R=el('div','');document.title=p.name+' · '+id;L.append(avatar(p,Math.min(300,innerWidth-70)));
 R.append(el('h1','',p.name));const idb=el('div','bigid',id);R.append(idb);const row=(...b)=>{const d=el('div','row');d.style.margin='12px 0';d.append(...b);return d};
 const btn=(t,f,c='line')=>{const b=el('button',c,t);b.onclick=f;return b},url=location.href.split('#')[0]+'#/profile/'+id;
 R.append(row(btn('Copy ID',()=>copy(id,'ID copied')),btn('Copy link',()=>copy(url,'Link copied')),btn('Open in new tab',()=>open(url,'_blank','noopener')),btn('Share',()=>navigator.share?navigator.share({title:p.name,url}).catch(()=>{}):copy(url,'Sharing is unavailable here. Link copied.'))));
 R.append(el('p','',p.desc),el('p','fine',`${FAM[p.fam]} · accent hue ${p.hue}° · symbol ${p.sym} · ${p.status}`));
 const fv=()=>favs.includes(id),fb=btn(fv()?'Remove favorite':'Favorite',()=>{fv()?favs.splice(favs.indexOf(id),1):favs.unshift(id);save();fb.textContent=fv()?'Remove favorite':'Favorite';toast(fv()?'Saved to favorites in this browser':'Removed from favorites')},'pri');
 R.append(row(fb,btn('Edit appearance',()=>editor(id)),e0(id)));
 R.append(row(btn('← Previous',()=>go((BigInt(id)-1n).toString())),btn('Next →',()=>go((BigInt(id)+1n).toString())),btn('Back to research',()=>location.hash='#/')));
 if(id==='0')R.querySelector('.row:last-child button').disabled=true;
 R.append(el('p','fine','Related identities (generated from this ID)'));const rel=el('div','rel');for(let k=1;k<=8;k++){const rid=(BigInt('0x'+hash(id+':'+k)[0].toString(16)+hash(id+':'+k)[1].toString(16))*3n+BigInt(id)).toString(),a=el('a');a.href='#/profile/'+rid;a.title=rid;a.append(avatar(gen(rid),64),el('div','',gen(rid).name));rel.append(a)}R.append(rel);w.append(L,R);app.append(w)}
const e0=id=>{const b=el('button','ghost','Reset edits');b.disabled=!edits[id];b.onclick=()=>{if(confirm('Remove your saved edits for this profile? The generated identity stays.')){delete edits[id];LS.set('sbu_e',edits);route()}};return b};
/* ---------- explorer: windowed virtual grid ---------- */
let vh=null;function unvirt(){if(vh){removeEventListener('scroll',vh);removeEventListener('resize',vh);vh=null}}
function explore(){const fl=el('div','tools'),fs=el('select');fs.setAttribute('aria-label','Filter by family');fs.append(new Option('All families','all'),...Object.entries(FAM).map(([k,v])=>new Option(v,k)),new Option('My edited profiles','mine'));
 const ss=el('select');ss.setAttribute('aria-label','Card size');[['s','Compact'],['m','Standard'],['l','Large']].forEach(([k,v])=>ss.append(new Option(v,k)));ss.value=S.size;const sd=el('input');sd.type='text';sd.inputMode='numeric';sd.placeholder='Jump to exact ID';sd.setAttribute('aria-label','Jump to ID');const er=el('p','err');
 sd.onkeydown=k=>{if(k.key==='Enter')goSearch(sd.value,er)};fl.append(fs,ss,sd);app.append(el('h1','','Explore'),el('p','fine','Generated identities appear forever; none are stored. Filters keep scanning the sequence until matches are found, so rare matches may take a moment.'),fl,er);
 const box=el('div');box.id='vp';const more=el('p','fine','Generating…');app.append(box,more);let list=[],next=0,cols=1,cw=0,ch=0,gap=12,rows=0,pool=new Map();
 const feedId=i=>(BigInt('0x'+hash('feed'+i).map(x=>x.toString(16).padStart(8,'0')).join('')) % (10n**30n)).toString();
 const ok=(id)=>fs.value==='all'||(fs.value==='mine'?false:gen(id).fam===fs.value);
 function fill(n){if(fs.value==='mine'){list=Object.keys(edits);return}let guard=0;while(list.length<n&&guard++<4000){const id=feedId(next++);if(ok(id))list.push(id)}}
 function layout(){const W=box.clientWidth,min={s:120,m:160,l:220}[S.size];cols=Math.max(1,Math.floor((W+gap)/(min+gap)));cw=(W-gap*(cols-1))/cols;ch=cw+({s:64,m:72,l:80}[S.size]);}
 function draw(){layout();const top=Math.max(0,scrollY-box.offsetTop),vp=innerHeight,r0=Math.max(0,Math.floor(top/(ch+gap))-2),r1=Math.floor((top+vp)/(ch+gap))+3;fill((r1+1)*cols+cols*4);rows=Math.ceil(list.length/cols);box.style.height=rows*(ch+gap)+'px';
  const keep=new Set();for(let r=r0;r<=r1&&r<rows;r++)for(let c=0;c<cols;c++){const i=r*cols+c;if(i>=list.length)break;keep.add(i);let a=pool.get(i);const id=list[i];
   if(!a||a.dataset.id!==id){a&&a.remove();const p=view(id);a=el('a','card');a.href='#/profile/'+id;a.dataset.id=id;a.append(avatar(p,Math.min(cw-26,200)),el('b','',p.name),el('small','id',id));a.title=id;box.append(a);pool.set(i,a)}
   a.style.cssText=`width:${cw}px;height:${ch}px;transform:translate(${c*(cw+gap)}px,${r*(ch+gap)}px)`}
  for(const[i,a]of pool)if(!keep.has(i)){a.remove();pool.delete(i)}more.textContent=fs.value==='mine'&&!list.length?'You have not saved any profile edits yet.':`${list.length} scanned into view. Keep scrolling.`}
 let t=0;vh=()=>{cancelAnimationFrame(t);t=requestAnimationFrame(draw)};addEventListener('scroll',vh,{passive:true});addEventListener('resize',vh);
 fs.onchange=()=>{list=[];next=0;box.replaceChildren();pool.clear();scrollTo(0,0);draw()};ss.onchange=()=>{S.size=ss.value;save();pool.forEach(a=>a.remove());pool.clear();draw()};draw()}
/* ---------- favorites ---------- */
function saved(){app.append(el('h1','','Saved'),el('p','fine','Favorites and edits live in this browser only. They are not synced to other devices.'));
 const t=el('div','tools'),ex=el('button','line','Export favorites'),im=el('button','line','Import favorites'),fi=el('input');fi.type='file';fi.accept='application/json';fi.hidden=true;
 ex.onclick=()=>{const a=el('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({sbu:1,favorites:favs})],{type:'application/json'}));a.download='silence-favorites.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),999)};
 im.onclick=()=>fi.click();fi.onchange=async()=>{try{const d=JSON.parse(await fi.files[0].text()),a=d&&Array.isArray(d.favorites)?d.favorites.map(x=>parseId(x)).filter(q=>q.id).map(q=>q.id):null;if(!a)throw 0;a.forEach(x=>{if(!favs.includes(x))favs.push(x)});save();toast(`Imported ${a.length} IDs`);route()}catch{toast('That file is not a valid favorites export.')}};
 const cr=el('button','ghost','Clear recent');cr.onclick=()=>{if(confirm('Clear the recently opened list?')){recent=[];save();route()}};t.append(ex,im,fi,cr);app.append(t);
 const g=el('div','grid2');if(!favs.length)app.append(el('p','note','No favorites yet. Open a profile and choose Favorite.'));
 favs.forEach(id=>{const p=view(id),c=el('div','card');c.style.cssText='position:static;height:auto';const a=el('a');a.href='#/profile/'+id;a.style.color='inherit';a.style.textDecoration='none';a.append(avatar(p,96),el('b','',p.name),el('small','',id));const rm=el('button','ghost','Remove');rm.onclick=()=>{favs.splice(favs.indexOf(id),1);save();route()};c.append(a,rm);g.append(c)});app.append(g);
 if(recent.length){const b=el('div');chipList('Recently opened',recent,b);app.append(b)}}
/* ---------- editor ---------- */
function editor(id){const base=view(id),d=$('#dEdit'),B=$('#edBody');B.replaceChildren();const L={fam:base.fam,shape:S.shape,bw:2,bc:'#dfe5f0',glow:8,zoom:1,rot:0,flip:false,br:100,ct:100,sa:100,hu:0,gray:0,...(base.edit&&base.edit.look)};let img=L.img||null;delete L.img;
 const pv=el('div','prev'),draw=()=>pv.replaceChildren(avatar({...base,edit:null},Math.min(240,innerWidth-90),{...L,img,noimg:!img}));
 B.append(el('h2','','Edit appearance'),pv);const mk=(lab,k,min,max,st=1)=>{const l=el('label','',lab),i=el('input');i.type='range';i.min=min;i.max=max;i.step=st;i.value=L[k];i.oninput=()=>{L[k]=+i.value;draw()};l.append(i);B.append(l);return i};
 const sel=(lab,k,opts)=>{const l=el('label','',lab),s=el('select');opts.forEach(([v,t])=>s.append(new Option(t,v)));s.value=L[k];s.onchange=()=>{L[k]=s.value;draw()};l.append(s);B.append(l)};
 sel('Avatar family (ID stays the same)','fam',Object.entries(FAM));sel('Shape / frame','shape',Object.keys(SHAPES).map(k=>[k,k]));
 const cl=el('label','','Frame & glow color'),ci=el('input');ci.type='color';ci.value=L.bc;ci.oninput=()=>{L.bc=ci.value;draw()};cl.append(ci);B.append(cl);
 mk('Border width','bw',0,12);mk('Glow','glow',0,30);mk('Zoom','zoom',.5,3,.05);mk('Rotate','rot',-180,180);mk('Brightness','br',40,180);mk('Contrast','ct',40,200);mk('Saturation','sa',0,250);mk('Hue','hu',0,360);mk('Grayscale','gray',0,100);
 const fl=el('label','row'),fc=el('input');fc.type='checkbox';fc.checked=L.flip;fc.onchange=()=>{L.flip=fc.checked;draw()};fl.append(fc,' Flip horizontally');B.append(fl);
 const up=el('input');up.type='file';up.accept='image/png,image/jpeg,image/webp,image/gif';up.hidden=true;const er=el('p','err');er.setAttribute('role','alert');
 up.onchange=()=>{const f=up.files[0];if(!f)return;if(!/^image\/(png|jpeg|webp|gif)$/.test(f.type)||f.size>8e6){er.textContent='Use a PNG, JPEG, WebP or GIF under 8 MB.';return}const u=URL.createObjectURL(f),im=new Image();im.onload=()=>{const c=document.createElement('canvas'),s=Math.min(1,320/Math.max(im.width,im.height));c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);img=c.toDataURL('image/jpeg',.82);URL.revokeObjectURL(u);er.textContent='';draw()};im.onerror=()=>{er.textContent='This file could not be decoded as an image.';URL.revokeObjectURL(u)};im.src=u};
 const A=el('div','acts'),b=(t,f,c='line')=>{const x=el('button',c,t);x.type='button';x.onclick=f;A.append(x)};
 b('Upload / replace image',()=>up.click());b('Remove image',()=>{img=null;draw()});b('Reset',()=>{Object.assign(L,{fam:base.fam,shape:S.shape,bw:2,bc:'#dfe5f0',glow:8,zoom:1,rot:0,flip:false,br:100,ct:100,sa:100,hu:0,gray:0});img=null;d.close();editor(id)});
 b('Save',()=>{const e={look:{...L,img}};edits[id]=e;if(!LS.set('sbu_e',edits)){delete edits[id];er.textContent='Browser storage is full or blocked, so nothing was saved.';return}d.close();toast('Saved in this browser');route()},'pri');b('Cancel',()=>d.close());B.append(er,up,A,el('p','fine','Edits are stored in this browser only. No backend is configured, so they do not sync.'));draw();d.showModal()}
/* ---------- settings ---------- */
const sf=$('#sFam'),ssh=$('#sShape');sf.append(new Option('Automatic (per ID)','auto'),...Object.entries(FAM).map(([k,v])=>new Option(v,k)));Object.keys(SHAPES).forEach(k=>ssh.append(new Option(k,k)));
const bind=(id,k,t,tr=x=>x)=>{const n=$(id);t==='c'?n.checked=S[k]:n.value=S[k];n.addEventListener(t==='c'?'change':'input',()=>{S[k]=t==='c'?n.checked:tr(n.value);applyS();if(['shape','size'].includes(k))route()})};
bind('#sVid','vid','c');bind('#sShade','shade','r',Number);bind('#sDepth','depth','r',Number);bind('#sMotion','calm','c');bind('#sSize','size','s');bind('#sShape','shape','s');bind('#sFam','fam','s');bind('#sContrast','hc','c');
$('#openSet').onclick=()=>$('#dSet').showModal();
$('#clrHist').onclick=()=>{if(confirm('Clear search history in this browser?')){hist=[];save();route()}};
$('#rstSet').onclick=()=>{if(confirm('Reset appearance settings? Favorites and edited profiles are kept.')){S={...DEF};save();location.reload()}};
applyS();route();
