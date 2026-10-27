// Pure business logic (no DOM) so it can be unit tested.
export const ORG={con:{n:"Construction Site",cap:8,mult:2,areas:["Scaffold A","Crane zone","Site gate"],ppl:[["Murugan",90],["Selvi",85],["Raju",95]]},
col:{n:"College Campus",cap:9,mult:1.5,areas:["Hostel block","Canteen","Labs"],ppl:[["Lakshmi",70],["Karthik",75],["Fatima",72]]}};
export const TYPES=["Safety hazard","Manager conduct","Pay issue"];
export const HR=36e5;
export const H=s=>{let a=0xdeadbeef,b=0x41c6ce57;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);a=Math.imul(a^c,2654435761);b=Math.imul(b^c,1597334677)}a=Math.imul(a^a>>>16,2246822507)^Math.imul(b^b>>>13,3266489909);b=Math.imul(b^b>>>16,2246822507)^Math.imul(a^a>>>13,3266489909);return(4294967296*(2097151&b)+(a>>>0)).toString(16)};
export function add(d,w,s,e){const p=d.sh.length?d.sh[d.sh.length-1].hash:"0";d.sh.push({w,s,e,prev:p,hash:H(p+w+s+e)})}
export function seed(g,now=Date.now()){const d={sh:[],open:{},rep:[],st:{}},d0=new Date(now);d0.setHours(0,0,0,0);const t0=d0.getTime();
for(let k=7;k>=1;k--)g.ppl.forEach((_,i)=>{if(i==2&&k%3==0)return;const s=t0-k*24*HR+8*HR;add(d,i,s,s+(g.cap+(i==0&&k<=3?5:0))*HR)});
for(const x of ["Platform board cracked","Loose railing near stairs"])d.rep.push({a:g.areas[0],ty:TYPES[0],x});return d}
// index of the first altered record, or -1 when the hash chain is intact
export function verify(d){let p="0";for(let i=0;i<d.sh.length;i++){const r=d.sh[i];if(r.prev!==p||H(p+r.w+r.s+r.e)!==r.hash)return i;p=r.hash}return-1}
export function calc(d,g,w){const rate=g.ppl[w][1];let reg=0,ot=0;d.sh.filter(r=>r.w==w).forEach(r=>{const h=(r.e-r.s)/HR;reg+=Math.min(h,g.cap);ot+=Math.max(0,h-g.cap)});return{reg,ot,rate,pay:Math.round(rate*(reg+ot*g.mult))}}
export function flags(d,w){const L=d.sh.filter(r=>r.w==w),f=[];if(L.some(r=>(r.e-r.s)/HR>12))f.push("Shift >12h");
const days=new Set(L.map(r=>new Date(r.s).toDateString()));if(days.size>=6)f.push(days.size+" days in a row");
for(let i=1;i<L.length;i++)if((L[i].s-L[i-1].e)/HR<10){f.push("Rest <10h");break}return f}
// reports are grouped by area+type; details are only shown to admins at 3+ reports
export function groups(d){const m={};d.rep.forEach(r=>{const k=r.a+"|"+r.ty;(m[k]=m[k]||{a:r.a,ty:r.ty,x:[]}).x.push(r.x)});return Object.entries(m)}
// Work passport: a worker's own records packed into a shareable code.
export function passport(d,g,w,org){return{v:1,o:org,n:g.ppl[w][0],r:d.sh.filter(r=>r.w==w).map(r=>[r.w,r.s,r.e,r.prev,r.hash])}}
export const encode=p=>btoa(JSON.stringify(p));
// Checks each record is self-consistent AND matches the issuing ledger. Demo only: production would verify a digital signature instead of a shared ledger.
export function checkPassport(code,ledgers,orgs){let p;try{p=JSON.parse(atob(code.trim()))}catch(e){return{ok:false,why:"Not a valid passport code"}}
const d=ledgers[p&&p.o];if(!d||!Array.isArray(p.r))return{ok:false,why:"Unknown issuer"};let ms=0;
for(const[w,s,e,prev,hash]of p.r){if(H(prev+w+s+e)!==hash)return{ok:false,why:"A record was edited after it was issued"};if(!d.sh.some(x=>x.hash===hash&&x.s===s&&x.e===e))return{ok:false,why:"A record does not match the employer's ledger"};ms+=e-s}
return{ok:true,name:p.n,sector:orgs[p.o].n,shifts:p.r.length,hours:+(ms/HR).toFixed(1)}}
// Hours worked per day for the last 7 days (oldest first), used by the admin heatmap.
export function heat(d,w,now=Date.now()){const t0=new Date(now).setHours(0,0,0,0);return[7,6,5,4,3,2,1].map(k=>d.sh.filter(r=>r.w==w&&r.s>=t0-k*864e5&&r.s<t0-(k-1)*864e5).reduce((a,r)=>a+(r.e-r.s)/HR,0))}
