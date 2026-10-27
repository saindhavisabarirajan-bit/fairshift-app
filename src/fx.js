// 3D particle hero: ~2.6k particles morph between a hard hat, a chain and a globe. Canvas 2D, no dependencies.
const hero=document.querySelector(".hero"),cv=hero.querySelector("canvas"),g=cv.getContext("2d"),cap=document.getElementById("cap");
const dpr=Math.min(devicePixelRatio||1,2),N=innerWidth<700||(navigator.hardwareConcurrency||8)<=4?1400:2600,rr=Math.random,rnd=()=>rr()*2-1;
const CAP=["Built for construction sites","A chain of trust, one record at a time","Decent work, everywhere"];
const hat=n=>Array.from({length:n},()=>{const k=rr();let x,y,z;
if(k<.6){const t=rr()*6.283,f=Math.acos(rr()),s=Math.sin(f);x=.9*s*Math.cos(t);z=.9*s*Math.sin(t);y=.75*Math.cos(f)}
else if(k<.85){const t=rr()*6.283,r=1+rr()*.35;x=r*Math.cos(t);z=r*Math.sin(t);y=-.02+rr()*.06}
else{z=rnd()*.88;x=rnd()*.1;y=.75*Math.sqrt(Math.max(0,1-(z/.9)**2))+.06+rr()*.04}
return[x,y-.2,z]});
const ring=(c,pl,R,r)=>{const u=rr()*6.283,v=rr()*6.283,w=R+r*Math.cos(v),a=w*Math.cos(u),b=w*Math.sin(u),d=r*Math.sin(v);return pl?[c+a,b,d]:[c+a,d,b]};
const chain=n=>Array.from({length:n},(_,i)=>i<n/2?ring(-.45,1,.7,.17):ring(.45,0,.7,.17));
const globe=n=>Array.from({length:n},(_,i)=>{const y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),t=i*2.39996;return[r*Math.cos(t),y,r*Math.sin(t)]});
const SH=[hat,chain,globe].map(f=>{const o=new Float32Array(N*3);f(N).forEach((p,i)=>o.set(p,i*3));return o});
const D=Float32Array.from({length:N},rr),GR=Uint8Array.from({length:N},()=>{const r=rr();return r<.55?0:r<.85?1:2});
const COL=["rgba(255,179,71,.9)","rgba(77,163,255,.9)","rgba(255,255,255,.85)"],IDX=[0,1,2].map(c=>{const a=[];GR.forEach((v,i)=>v==c&&a.push(i));return a});
const ST=Array.from({length:130},()=>[rr(),rr(),rr()]),PX=new Float32Array(N),PY=new Float32Array(N),PS=new Float32Array(N);
let k=0,F=SH[0],T=SH[0],t0=performance.now(),moved=false,W=1,H=1,yaw=0,yo=0,po=0,mx=0,my=0,run=true;
cap.textContent=CAP[0];
function size(){W=hero.clientWidth;H=hero.clientHeight;cv.width=W*dpr;cv.height=H*dpr}
function frame(now){let tf=Math.max(0,(now-t0-4200)/2400);
if(tf>0&&!moved){moved=true;cap.textContent=CAP[(k+1)%3]}
if(tf>=1){F=T;k=(k+1)%3;T=SH[k];t0=now;moved=false;tf=0}
yo+=(mx*.8-yo)*.05;po+=(my*.35+.3-po)*.05;yaw+=.0045;
const ya=yaw+yo,cy=Math.cos(ya),sy=Math.sin(ya),cp=Math.cos(po),sp=Math.sin(po);
g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cv.width,cv.height);g.globalCompositeOperation="lighter";g.fillStyle="#fff";
for(const[a,b,c]of ST){g.globalAlpha=(.4+.6*Math.abs(Math.sin(now/900+a*20)))*.8;g.fillRect((a*W+mx*c*30)*dpr,(b*H+my*c*30)*dpr,(c+.6)*dpr,(c+.6)*dpr)}
g.globalAlpha=1;
const nar=W<760,ox=(nar?.5:.7)*W*dpr,oy=(nar?.74:.5)*H*dpr,Rp=Math.min(nar?W*.42:W*.3,H*.4)*dpr;
for(let i=0;i<N;i++){const l=Math.min(1,Math.max(0,(tf-D[i]*.5)/.5)),e=l*l*(3-2*l),j=i*3,
x=F[j]+(T[j]-F[j])*e,y=F[j+1]+(T[j+1]-F[j+1])*e+Math.sin(e*3.1416)*.35*(D[i]-.5),z=F[j+2]+(T[j+2]-F[j+2])*e,
x1=x*cy+z*sy,z1=z*cy-x*sy,y1=y*cp-z1*sp,z2=y*sp+z1*cp,s=3/(3-z2);PX[i]=ox+x1*Rp*s;PY[i]=oy-y1*Rp*s;PS[i]=s}
for(let c=0;c<3;c++){g.fillStyle=COL[c];for(const i of IDX[c]){const q=(.9+1.5*PS[i])*dpr*.85;g.fillRect(PX[i]-q/2,PY[i]-q/2,q,q)}}}
size();
if(matchMedia("(prefers-reduced-motion:reduce)").matches){frame(t0);new ResizeObserver(()=>{size();frame(t0)}).observe(hero)}
else{new ResizeObserver(size).observe(hero);new IntersectionObserver(e=>run=e[0].isIntersecting).observe(hero);
hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect();mx=(e.clientX-r.left)/r.width*2-1;my=(e.clientY-r.top)/r.height*2-1});
hero.addEventListener("pointerleave",()=>mx=my=0);
(function loop(t){if(run&&!document.hidden)frame(t);requestAnimationFrame(loop)})(t0)}
