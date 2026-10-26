const $=(s,r=document)=>r.querySelector(s);
const el=(t,p={},...k)=>{const e=Object.assign(document.createElement(t),p);k.forEach(c=>e.append(c));return e};
const view=$('#view'),tabs=$('#tabs');
function toolList(list){
 const box=el('div');
 list.forEach(t=>{
  const inp=el('textarea',{rows:3,placeholder:'input'}),key=t.key?el('input',{placeholder:t.key}):null,out=el('pre',{className:'out'});
  const go=el('button',{textContent:'run',onclick:()=>{try{out.textContent=t.run(inp.value,key&&key.value)}catch(e){out.textContent='Error: '+e.message}}});
  box.append(el('details',{},el('summary',{textContent:t.name}),el('div',{className:'desc',textContent:t.desc||''}),inp,...(key?[key]:[]),go,out));
 });
 return box;
}
function finderView(){
 const inp=el('input',{placeholder:'handle, e.g. exampleuser',maxLength:41,autocapitalize:'none'}),out=el('div'),info=el('pre',{className:'out'});
 const clean=()=>{const h=inp.value.trim().replace(/^@/,'');return /^[\w.\-]{2,40}$/.test(h)?h:null};
 const mk=(h,[n,t])=>{const li=el('li');
  li.append(el('a',{href:t.replaceAll('{h}',encodeURIComponent(h)),target:'_blank',rel:'noopener noreferrer',textContent:n}),
  el('button',{className:'x',title:'not it, remove',textContent:'\u00d7',onclick:()=>{const ul=li.parentNode,g=ul.parentNode;li.remove();if(!ul.children.length)g.remove()}}));return li};
 const grp=(h,title,list)=>{const li=el('li',{textContent:title}),ul=el('ul');list.forEach(x=>ul.append(mk(h,x)));li.append(ul);return li};
 const build=el('button',{textContent:'build tree',onclick:()=>{const h=clean();
  if(!h){out.textContent='Use 2-40 letters, numbers, _ . -';return}
  const stem=el('li',{textContent:h}),br=el('ul');br.append(grp(h,'profiles (candidates)',PROFILES),grp(h,'history & search',SEARCHES));stem.append(br);
  out.replaceChildren(el('ul',{className:'tree'},stem),el('p',{className:'desc',textContent:'Branches are candidate links for the same handle. Open each to verify; \u00d7 removes a branch.'}))}});
 const rb=el('button',{textContent:'roblox: details + past usernames',onclick:async()=>{const h=clean();if(!h){info.textContent='Enter a valid handle first.';return}
  info.textContent='looking up...';try{info.textContent=await robloxLookup(h)}catch(e){info.textContent='Lookup failed ('+e.message+'). The mirror may be down or blocked.'}}});
 return el('div',{},inp,build,' ',rb,info,out);
}
const SECTIONS={finder:finderView,detective:()=>toolList(DETECTIVE),fun:()=>toolList(FUN)};
const COUNTS={finder:'30',detective:'10',fun:'5'};
function show(n){tabs.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.t===n));view.replaceChildren(SECTIONS[n]());history.replaceState(null,'','#'+n)}
Object.keys(SECTIONS).forEach(n=>{const b=el('button',{textContent:`${n} (${COUNTS[n]})`,onclick:()=>show(n)});b.dataset.t=n;tabs.append(b)});
show(SECTIONS[location.hash.slice(1)]?location.hash.slice(1):'finder');
