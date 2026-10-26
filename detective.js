const MORSE={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.'};
const rot=(s,n)=>s.replace(/[a-z]/gi,c=>{const b=c<'a'?65:97;return String.fromCharCode(((c.charCodeAt(0)-b+n)%26+26)%26+b)});
const printable=s=>s.length>0&&[...s].filter(c=>/[\x20-\x7e\n]/.test(c)).length/s.length>0.9;
const attempt=f=>{try{return f()}catch{return null}};
const DETECTIVE=[
{name:'Caesar brute-force',desc:'Tries all 25 shifts.',run:t=>Array.from({length:25},(_,i)=>`${i+1}: ${rot(t,i+1)}`).join('\n')},
{name:'Auto-decoder',desc:'Tries Base64, hex, binary, URL, ROT13.',run:t=>{const s=t.trim(),r=[];
 const add=(n,v)=>v&&v!==s&&printable(v)&&r.push(`[${n}] ${v}`);
 add('base64',attempt(()=>atob(s)));
 add('hex',attempt(()=>s.replace(/0x|\s/g,'').match(/../g).map(h=>String.fromCharCode(parseInt(h,16))).join('')));
 add('binary',attempt(()=>s.split(/\s+/).map(b=>String.fromCharCode(parseInt(b,2))).join('')));
 add('url',attempt(()=>decodeURIComponent(s)));
 add('rot13',rot(s,13));
 return r.join('\n')||'No readable decoding found.'}},
{name:'Morse',desc:'Auto encode/decode. Use / between words.',run:t=>{const inv=Object.fromEntries(Object.entries(MORSE).map(([k,v])=>[v,k]));
 return /^[.\-\/\s]+$/.test(t)?t.trim().split(/\s*\/\s*/).map(w=>w.split(/\s+/).map(c=>inv[c]||'?').join('')).join(' '):t.toUpperCase().split(/\s+/).map(w=>[...w].map(c=>MORSE[c]||'?').join(' ')).join(' / ')}},
{name:'Atbash',desc:'A<->Z mirror cipher.',run:t=>t.replace(/[a-z]/gi,c=>{const b=c<'a'?65:97;return String.fromCharCode(b+25-(c.charCodeAt(0)-b))})},
{name:'Vigenere decode',desc:'Needs the key.',key:'key',run:(t,k)=>{k=(k||'').replace(/[^a-z]/gi,'').toLowerCase();if(!k)return 'Enter a key.';let i=0;return t.replace(/[a-z]/gi,c=>rot(c,-(k.charCodeAt(i++%k.length)-97)))}},
{name:'Hash identifier',desc:'Guesses hash type from shape.',run:t=>{const s=t.trim(),L={32:'MD5/NTLM',40:'SHA-1',56:'SHA-224',64:'SHA-256',96:'SHA-384',128:'SHA-512'};
 if(/^\$2[aby]\$/.test(s))return 'bcrypt';
 if(/^[a-f0-9]+$/i.test(s))return L[s.length]?`Likely ${L[s.length]} (${s.length} hex chars)`:`Hex, ${s.length} chars, unknown type`;
 return 'Not a plain hex hash.'}},
{name:'A1Z26',desc:'Numbers <-> letters.',run:t=>/^[\d\s,-]+$/.test(t)?t.trim().split(/[\s,-]+/).map(n=>String.fromCharCode(64+ +n)).join(''):[...t.toUpperCase()].map(c=>/[A-Z]/.test(c)?c.charCodeAt(0)-64:c).join(' ')},
{name:'Letter frequency',desc:'Spot substitution ciphers.',run:t=>{const m={};for(const c of t.toLowerCase().replace(/[^a-z]/g,''))m[c]=(m[c]||0)+1;return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([c,n])=>`${c} ${'#'.repeat(Math.min(n,40))} ${n}`).join('\n')||'No letters.'}},
{name:'Discord ID -> date',desc:'Decodes a snowflake ID into its creation time.',run:t=>{try{return new Date(Number((BigInt(t.trim())>>22n)+1420070400000n)).toISOString()}catch{return 'Enter a numeric ID.'}}},
{name:'Reverse / mirror',desc:'Reversed text, word order, sorted letters.',run:t=>`reversed: ${[...t].reverse().join('')}\nword order: ${t.split(/\s+/).reverse().join(' ')}\nletters sorted: ${[...t.toLowerCase().replace(/[^a-z]/g,'')].sort().join('')}`}
];
