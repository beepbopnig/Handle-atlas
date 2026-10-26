const pick=a=>a[Math.random()*a.length|0];
const FUN=[
{name:'Username generator',desc:'8 fresh ideas.',run:()=>Array.from({length:8},()=>pick(['Dusty','Quiet','Rusty','Lunar','Pixel','Hollow','Mossy','Static'])+pick(['Fox','Cipher','Owl','Ember','Rook','Moth','Comet','Anvil'])+(Math.random()*99|0)).join('\n')},
{name:'Dice & coin',desc:'Type 2d6 (any NdM) or leave empty for a coin flip.',run:t=>{const m=/^(\d{1,2})d(\d{1,3})$/.exec(t.trim());if(!m)return pick(['Heads','Tails']);const r=Array.from({length:+m[1]},()=>(1+Math.random()*+m[2])|0);return `${r.join(' + ')} = ${r.reduce((a,b)=>a+b)}`}},
{name:'Glitch text',desc:'Corrupts your text.',run:t=>[...t].map(c=>c+Array.from({length:2},()=>String.fromCharCode((0x300+Math.random()*60)|0)).join('')).join('')},
{name:'Puzzle maker',desc:'Hides a message: Base64 -> ROT13 -> reversed. Friends solve it backwards.',run:t=>[...rot(btoa(unescape(encodeURIComponent(t))),13)].reverse().join('')},
{name:'Magic 8-ball',desc:'Ask anything.',run:()=>pick(['Yes.','No.','Ask again later.','Signs point to yes.','Very doubtful.','Without a doubt.','Cannot predict now.'])}
];
