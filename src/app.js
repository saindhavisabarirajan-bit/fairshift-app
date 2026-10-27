import {ORG,TYPES,HR,seed as seedOrg,add as addRec,verify as ver,calc as cal,flags as fl,groups as grp,passport,encode,checkPassport,heat,H} from "./core.js";

const T={en:{ci:"Check in",co:"Check out",pay:"Payslip",hrs:"Regular hours",ot:"Overtime hours",tot:"Total pay",rep:"Report a problem",send:"Send anonymously",ver:"Records verified",alt:"Records altered!",hello:"Hello",say:"Read aloud",in:"You are checked in"},
ta:{ci:"வருகை பதிவு",co:"வெளியேறு",pay:"சம்பளச் சீட்டு",hrs:"சாதாரண மணி",ot:"கூடுதல் நேரம்",tot:"மொத்த சம்பளம்",rep:"புகார் அளி",send:"பெயரின்றி அனுப்பு",ver:"பதிவுகள் சரிபார்க்கப்பட்டன",alt:"பதிவுகள் மாற்றப்பட்டன!",hello:"வணக்கம்",say:"படித்துக் காட்டு",in:"நீங்கள் உள்ளே உள்ளீர்கள்"},
hi:{ci:"हाजिरी लगाएँ",co:"बाहर निकलें",pay:"वेतन पर्ची",hrs:"सामान्य घंटे",ot:"ओवरटाइम घंटे",tot:"कुल वेतन",rep:"समस्या बताएँ",send:"गुमनाम भेजें",ver:"रिकॉर्ड सत्यापित",alt:"रिकॉर्ड बदले गए!",hello:"नमस्ते",say:"सुनें",in:"आप अंदर हैं"}};
const SP={en:"en-IN",ta:"ta-IN",hi:"hi-IN"};
let PI=0,KEY="",LX=innerWidth/2,LY=innerHeight/2;addEventListener("pointerdown",e=>{LX=e.clientX;LY=e.clientY});
const S={org:"con",role:"w",lang:"en",wk:0,len:9,mine:[],pp:"",vr:null,vc:""},D={};
const t=k=>T[S.lang][k]||T.en[k];
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const seed=o=>{D[o]=seedOrg(ORG[o])},add=(o,...a)=>addRec(D[o],...a),verify=o=>ver(D[o]),calc=(o,w)=>cal(D[o],ORG[o],w),flags=(o,w)=>fl(D[o],w),groups=o=>grp(D[o]);
const fmt=ms=>new Date(ms).toLocaleString([], {day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});
function speak(txt){try{const u=new SpeechSynthesisUtterance(txt);u.lang=SP[S.lang];speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
function hdr(){const i=S.role=="w"?0:1,f=PI;PI=i;return`<header><h1><span class="logo" aria-hidden="true">F</span> FairShift<span class="m">Decent Work · SDG 8</span></h1><div class="r">
<select aria-label="Sector" onchange="S.org=this.value;render()">${Object.entries(ORG).map(([k,v])=>`<option value="${k}" ${S.org==k?"selected":""}>${v.n}</option>`)}</select>
<select aria-label="Language" onchange="S.lang=this.value;render()"><option value="en">English</option><option value="ta" ${S.lang=="ta"?"selected":""}>தமிழ்</option><option value="hi" ${S.lang=="hi"?"selected":""}>हिन्दी</option></select>
<div class="seg" style="--i:${i};--f:${f}"><button class="t ${S.role=="w"?"on":""}" aria-pressed="${S.role=="w"}" onclick="S.role='w';render()">Worker</button><button class="t ${S.role=="a"?"on":""}" aria-pressed="${S.role=="a"}" onclick="S.role='a';render()">Admin</button></div></div></header>`}
function worker(){const o=S.org,g=ORG[o],w=S.wk,op=D[o].open[w],c=calc(o,w),bad=verify(o);
const say=`${t("hello")} ${g.ppl[w][0]}. ${t("hrs")} ${c.reg}. ${t("ot")} ${c.ot}. ${t("tot")} ${c.pay} rupees.`;
const mine=S.mine.map(k=>{const gr=groups(o).find(x=>x[0]==k);return gr?`<li>${esc(gr[1].a)} · ${esc(gr[1].ty)} — <b>${D[o].st[k]||"Received"}</b></li>`:""}).join("");
return`<div class="c"><div class="r"><select aria-label="Worker" onchange="S.wk=+this.value;render()">${g.ppl.map((p,i)=>`<option value="${i}" ${w==i?"selected":""}>${p[0]}</option>`)}</select>
<span class="pill ${bad<0?"ok":"bad"}">${bad<0?"✔ "+t("ver"):"⚠ "+t("alt")}</span></div></div>
<div class="c"><h2>${op?t("in")+" · "+fmt(op.s):"Ready for your shift"}</h2>
${op?`<div class="r m">Demo shift length <select aria-label="Demo shift length in hours" onchange="S.len=+this.value">${[4,8,9,10,12,13].map(h=>`<option ${S.len==h?"selected":""}>${h}</option>`)}</select> h</div><div class="live" id="lv"><span id="live">₹0</span><small id="lh">0.0h</small></div><button class="orb out" onclick="out()"><span aria-hidden="true"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg></span>${t("co")}</button>`:`<button class="orb" onclick="inn()"><span aria-hidden="true"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span>${t("ci")}</button><p class="m ctr">Scan the site QR to start your shift</p>`}</div>
<div class="c receipt"><h2>${t("pay")}</h2><table><tr><td>${t("hrs")}</td><td>${c.reg}h × ₹${c.rate}</td></tr><tr><td>${t("ot")} (×${g.mult})</td><td>${c.ot}h × ₹${c.rate*g.mult}</td></tr><tr><th>${t("tot")}</th><th>₹${c.pay}</th></tr></table>
<p class="m">Every line comes from your tamper-proof check-ins below.</p><button class="p" onclick="speak(${esc(JSON.stringify(JSON.stringify(say)))})">${t("say")}</button></div>
<div class="c"><h2>Check-ins</h2><ol class="chain">${D[o].sh.filter(r=>r.w==w).slice(-5).map(r=>`<li><b>${fmt(r.s)}</b> · ${((r.e-r.s)/HR).toFixed(1)}h<code>#${r.hash.slice(0,8)}</code></li>`).join("")}</ol></div>
<div class="c"><h2>Work passport</h2><p class="m">A code proving your verified hours. Share it with any new employer, in any sector.</p><button class="p" onclick="mkpp()">Create my passport</button>${S.pp?`<div class="pp">${qr(S.pp)}<textarea readonly aria-label="Your passport code">${S.pp}</textarea></div>`:""}</div>
<div class="c"><h2>${t("rep")}</h2><div class="r"><select id="ra" aria-label="Area">${g.areas.map(a=>`<option>${a}</option>`)}</select><select id="rt" aria-label="Issue type">${TYPES.map(a=>`<option>${a}</option>`)}</select></div><br>
<textarea id="rx" aria-label="Describe the problem" placeholder="Describe the problem, or tap Speak"></textarea><div class="r"><button class="t" aria-label="Speak your report" onclick="mic()">Speak</button><button class="p" onclick="sendRep()">${t("send")}</button></div>
<p class="m">No name is stored. Managers only see details once 3+ workers report the same issue.</p>${mine?`<ul>${mine}</ul>`:""}</div>`}
function admin(){const o=S.org,g=ORG[o],bad=verify(o);let hrs=0,otH=0;
const rows=g.ppl.map((p,i)=>{const c=calc(o,i),f=flags(o,i);hrs+=c.reg+c.ot;otH+=c.ot;const risk=f.length>=2?["High","bad"]:f.length?["Medium","wa"]:["Low","ok"];
return`<tr><td>${p[0]}</td><td><div class="bar" style="--v:${Math.min(100,(c.reg+c.ot)/60*100)}%"></div>${(c.reg+c.ot).toFixed(0)}h</td><td>${c.ot.toFixed(0)}</td><td>${f.join(", ")||"–"}</td><td><span class="pill ${risk[1]}">${risk[0]}</span></td></tr>`}).join("");
const gr=groups(o),open=gr.filter(x=>x[1].x.length>=3&&D[o].st[x[0]]!="Resolved").length;
const rg=gr.map(([k,v])=>v.x.length>=3?`<div class="c rep hot"><b>${esc(v.a)} · ${esc(v.ty)}</b> <span class="m">(${v.x.length} reports)</span><ul>${v.x.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
<div class="r">${["Received","In progress","Resolved"].map(s=>`<button class="t ${(D[o].st[k]||"Received")==s?"on":""}" onclick='stat(${JSON.stringify(k)},"${s}")'>${s}</button>`).join("")}</div></div>`
:`<div class="c rep"><b>${esc(v.a)} · ${esc(v.ty)}</b><br><span class="m">${v.x.length} report(s). Details hidden until 3 workers report (protects identity).</span></div>`).join("");
return`<div class="g"><div class="c stat"><div class="m">Workers</div><div class="n">${g.ppl.length}</div></div><div class="c stat"><div class="m">Hours (7d)</div><div class="n">${hrs.toFixed(0)}</div></div><div class="c stat"><div class="m">Overtime</div><div class="n">${otH.toFixed(0)}h</div></div><div class="c stat"><div class="m">Open issues</div><div class="n">${open}</div></div></div>
<div class="c"><h2>Attendance ledger</h2><div class="blocks" role="img" aria-label="Ledger blocks, red means altered">${D[o].sh.map((r,i)=>`<i style="--d:${Math.max(0,i-bad)}" class="${bad>=0&&i>=bad?"x":""}"></i>`).join("")}</div><p class="${bad<0?"ok":"bad"}">${bad<0?"✔ All "+D[o].sh.length+" records verified (hash chain intact)":"⚠ Record #"+(bad+1)+" was altered after it was logged"}</p>
<div class="r"><button onclick="tamper()">Demo: edit a past record</button><button onclick="seed(S.org);render()">Reset</button></div></div>
<div class="c"><h2>Seven-day fatigue heatmap</h2><div class="heat">${g.ppl.map((p,i)=>`<b>${p[0]}</b>${heat(D[o],i).map(h=>`<i class="${h>g.cap?"hi":""}" style="--p:${Math.min(100,h/13*100)}%" title="${h.toFixed(0)}h">${h?h.toFixed(0):"–"}</i>`).join("")}`).join("")}</div><p class="m">Darker means a longer shift. Outlined cells go past the ${g.cap}h daily cap.</p></div>
<div class="c"><h2>Fatigue &amp; quit risk</h2><div class="sc"><table><tr><th>Worker</th><th>Hours</th><th>OT</th><th>Flags</th><th>Quit risk</th></tr>${rows}</table></div><p class="m">Rules for ${g.n}: ${g.cap}h/day, OT ×${g.mult}, 10h rest, max 6 days in a row. Quit risk = number of flags.</p></div>
<div class="c"><h2>Verify a work passport</h2><p class="m">New hire? Paste the code they share to confirm their record from any sector.</p><textarea id="vc" aria-label="Passport code">${esc(S.vc)}</textarea><button class="p" onclick="chk()">Verify</button>${S.vr?(S.vr.ok?`<p class="ok">Verified: ${esc(S.vr.name)}, ${S.vr.shifts} shifts, ${S.vr.hours}h at ${esc(S.vr.sector)}</p>`:`<p class="bad">Not verified: ${esc(S.vr.why)}</p>`):""}</div>
<h2>Anonymous reports</h2>${rg}`}
function inn(){D[S.org].open[S.wk]={s:Date.now()};render();fx("Shift started")}
function out(){const o=D[S.org].open[S.wk];add(S.org,S.wk,o.s,o.s+S.len*HR);delete D[S.org].open[S.wk];render();fx("Shift saved to your ledger")}
function tamper(){const r=D[S.org].sh[3];r.e+=2*HR;render();fx("Record edited: chain broken",0)}
function sendRep(){const x=$("#rx").value.trim();if(!x)return;const a=$("#ra").value,ty=$("#rt").value,k=a+"|"+ty;D[S.org].rep.push({a,ty,x});if(!S.mine.includes(k))S.mine.push(k);render();fx("Report sent anonymously")}
function qr(c){const n=21,fin=(x,y)=>[[0,0],[14,0],[0,14]].some(([a,b])=>{const u=x-a,v=y-b;return u>=0&&u<7&&v>=0&&v<7&&(u%6==0||v%6==0||(u>1&&u<5&&v>1&&v<5))});let r="";
for(let y=0;y<n;y++)for(let x=0;x<n;x++){const inF=(x<8&&y<8)||(x>13&&y<8)||(x<8&&y>13);if(inF?fin(x,y):parseInt(H(c+x+","+y).slice(-1),16)&1)r+=`<rect x="${x}" y="${y}" width="1" height="1"/>`}
return`<svg viewBox="0 0 21 21" role="img" aria-label="Unique seal drawn from your passport code" fill="currentColor">${r}</svg>`}
function mkpp(){S.pp=encode(passport(D[S.org],ORG[S.org],S.wk,S.org));render();fx("Passport created")}
function chk(){S.vc=$("#vc").value;S.vr=checkPassport(S.vc,D,ORG);render();fx(S.vr.ok?"Passport verified":"Verification failed",S.vr.ok)}
function stat(k,s){D[S.org].st[k]=s;render()}
function mic(){const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R)return alert("Voice input not supported in this browser");const r=new R();r.lang=SP[S.lang];r.onresult=e=>{$("#rx").value=e.results[0][0].transcript};r.start()}
function fx(m,b=1){if(b)for(let k=0;k<18;k++){const n=document.createElement("i"),a=Math.random()*6.28,d=60+Math.random()*90;n.className="bs";n.style.cssText=`left:${LX}px;top:${LY}px;--x:${Math.cos(a)*d}px;--y:${Math.sin(a)*d}px`;document.body.append(n);setTimeout(()=>n.remove(),950)}
const e=document.createElement("div");e.className="toast";e.setAttribute("role","status");e.textContent=m;document.body.append(e);setTimeout(()=>e.remove(),2400)}
function render(){document.body.dataset.org=S.org;document.documentElement.lang=S.lang;const k=S.org+S.role+S.lang,en=k!=KEY;KEY=k;$("#app").innerHTML=hdr()+`<div class="v-${S.role}${en?" enter":""}">`+(S.role=="w"?worker():admin())+"</div>";if(en)enter()}
function enter(){const q=x=>document.querySelectorAll(".enter "+x);document.querySelectorAll(".enter>*").forEach((e,i)=>e.style.animationDelay=i*70+"ms");
q(".heat i").forEach((e,i)=>e.style.animationDelay=300+i*20+"ms");q(".blocks i").forEach((e,i)=>e.style.animationDelay=300+i*12+"ms");
if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;q(".n").forEach(el=>{const m=el.textContent.match(/^(\d+)(.*)$/);if(!m)return;const to=+m[1],t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/900);el.textContent=Math.round(to*(1-(1-k)**3))+m[2];if(k<1)requestAnimationFrame(f)})(t0)})}
Object.assign(window,{fx,mkpp,chk,S,render,speak,seed,inn,out,tamper,sendRep,stat,mic});
seed("con");seed("col");render();
setInterval(()=>{if(S.role!="w")return;const op=D[S.org].open[S.wk],el=$("#live");if(!op||!el)return;const g=ORG[S.org],h=(Date.now()-op.s)*360/HR;
el.textContent="₹"+Math.round(g.ppl[S.wk][1]*(Math.min(h,g.cap)+Math.max(0,h-g.cap)*g.mult));$("#lh").textContent=h.toFixed(1)+"h (demo speed x360)";$("#lv").classList.toggle("ot",h>g.cap)},100);
document.querySelectorAll(".pick button").forEach(b=>b.onclick=()=>{S.role=b.dataset.role;render();document.querySelector("main").scrollIntoView({behavior:"smooth"})});
