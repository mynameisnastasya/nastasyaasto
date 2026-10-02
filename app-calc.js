function bodyEnum(name){return Astronomy.Body[name]}
function norm360(x){return (x%360+360)%360}
function signedDiff(a,b){let d=norm360(a-b);return d>180?d-360:d}

function longitude(bodyName,date){
  const key=bodyName+"@"+Math.round(date.getTime()/1000);
  if(lonCache.has(key)) return lonCache.get(key);
  const v=Astronomy.GeoVector(bodyEnum(bodyName),date,true);
  const lon=norm360(Astronomy.Ecliptic(v).elon);
  lonCache.set(key,lon);
  return lon;
}

function signIndex(lon){return Math.floor(norm360(lon)/30)}

function houseOf(lon){
  const d=norm360(lon-CUSPS[0]); let h=1;
  for(const c of CUSP_OFF){if(d+1e-8>=c.off)h=c.house;else break}
  return h;
}

function motion(body,date){
  const h=(body==="Moon"?3:12)*3600000;
  const a=longitude(body,new Date(date.getTime()-h));
  const b=longitude(body,new Date(date.getTime()+h));
  return signedDiff(b,a)<0?"R":"D";
}

function stateAt(p,date,needMotion=true){
  const lon=longitude(p.body,date);
  return {lon,sign:signIndex(lon),house:houseOf(lon),motion:needMotion?motion(p.body,date):null};
}

function fmtDeg(lon){
  const within=norm360(lon)%30, d=Math.floor(within), m=Math.floor((within-d)*60);
  return `${String(d).padStart(2,"0")}°${String(m).padStart(2,"0")}′`;
}

function fmtDate(d,withTime=true){
  const opt=withTime
    ?{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}
    :{day:"numeric",month:"long",year:"numeric"};
  return new Intl.DateTimeFormat("ru-RU",opt).format(d);
}

function dayDiff(a,b){return (b-a)/86400000}

function durationText(days){
  if(days<1){const h=Math.max(1,Math.round(days*24));return `${h} ч`}
  if(days<45)return `${Math.max(1,Math.round(days))} дн.`
  if(days<730)return `${(days/30.44).toFixed(days<120?1:0)} мес.`
  return `${(days/365.25).toFixed(1)} г.`
}

function addDays(date,n){return new Date(date.getTime()+n*86400000)}
function sameByType(state,base,type){return type==="sign"?state.sign===base.sign:state.house===base.house}

function findTransition(p,date,type){
  const base=stateAt(p,date,false); let prev=new Date(date);
  for(let d=p.step;d<=p.max;d+=p.step){
    const b=addDays(date,d), st=stateAt(p,b,false);
    if(!sameByType(st,base,type)){
      let lo=prev.getTime(),hi=b.getTime();
      for(let i=0;i<28;i++){
        const mid=new Date((lo+hi)/2);
        if(sameByType(stateAt(p,mid,false),base,type))lo=mid.getTime();else hi=mid.getTime();
      }
      const when=new Date(hi+1000);
      return {when,state:stateAt(p,when,false),days:dayDiff(date,when),type};
    }
    prev=b;
  }
  return null;
}

function findPrevTransition(p,date,type){
  const base=stateAt(p,date,false), limit=Math.min(p.max,5600), step=p.step;
  let prev=new Date(date);
  for(let d=step;d<=limit;d+=step){
    const b=addDays(date,-d), st=stateAt(p,b,false);
    if(!sameByType(st,base,type)){
      let lo=b.getTime(),hi=prev.getTime();
      for(let i=0;i<26;i++){
        const mid=new Date((lo+hi)/2);
        if(sameByType(stateAt(p,mid,false),base,type))hi=mid.getTime();else lo=mid.getTime();
      }
      return new Date(hi);
    }
    prev=b;
  }
  return addDays(date,-30);
}

function progression(p,date,next,type){
  const prev=findPrevTransition(p,date,type);
  const total=Math.max(1,next.when-prev),done=Math.max(0,date-prev);
  return Math.min(100,Math.max(0,done/total*100));
}

function natalFor(key){return NATAL.find(x=>x[0]===key)}

function interpret(p,st){
  return `${p.name} отвечает у тебя за ${p.theme}. Сейчас ${SIGNS[st.sign]} задаёт этому тему: ${SIGN_STYLE[st.sign]}. Всё это разворачивается через ${st.house} дом — ${HOUSE_DOMAIN[st.house]}. Практический фокус: ${HOUSE_ACTION[st.house]}. Риск: ${HOUSE_RISK[st.house]}.`;
}

function natalBridge(p){
  const n=natalFor(p.key);
  if(!n)return "";
  return ` Натально ${p.name} стоит в ${n[4]} ${n[5]}, ${n[6]}; поэтому текущий транзит читается не отдельно, а как новый слой поверх этой врождённой темы.`;
}

function transitionMeaning(p,now,next){
  const parts=[];
  if(now.sign!==next.sign)parts.push(`знак меняется с ${SIGNS[now.sign]} на ${SIGNS[next.sign]}: вместо «${SIGN_STYLE[now.sign]}» акцент смещается в «${SIGN_STYLE[next.sign]}»`);
  if(now.house!==next.house)parts.push(`фокус переходит из ${now.house} дома (${HOUSE_DOMAIN[now.house]}) в ${next.house} дом (${HOUSE_DOMAIN[next.house]})`);
  return parts.join(". ")+".";
}

function activeAspects(lon,p,date){
  const orbLimit=["jupiter","saturn","uranus","neptune","pluto"].includes(p.key)?4.0:2.5;
  const out=[], futureLon=longitude(p.body,addDays(date,p.key==="moon"?.08:.5));
  for(const n of NATAL){
    const sep=Math.abs(signedDiff(lon,n[3]));
    const futureSep=Math.abs(signedDiff(futureLon,n[3]));
    for(const [name,angle,glyph] of ASPECTS){
      const orb=Math.abs(sep-angle);
      if(orb<=orbLimit){
        const futureOrb=Math.abs(futureSep-angle);
        out.push({name,angle,glyph,orb,natal:n,trend:futureOrb<orb?"сходится":"расходится"});
      }
    }
  }
  return out.sort((a,b)=>a.orb-b.orb).slice(0,6);
}

function aspectMeaning(a){
 const target=a.natal[1];
 const map={
  "соединение":"сливает транзит и натальную функцию в одну громкую тему",
  "секстиль":"даёт удобный канал, который работает лучше, если самой им воспользоваться",
  "квадрат":"создаёт трение и требует изменить привычный способ действовать",
  "трин":"усиливает естественный поток и то, что уже умеет работать без лишнего сопротивления",
  "квинконс":"требует тонкой перенастройки: старые настройки вроде работают, но уже не идеально",
  "оппозиция":"выносит тему наружу через других людей, обстоятельства и необходимость баланса"
 };
 return `${a.name} к ${target}: ${map[a.name]}.`;
}

function nearestTransition(ns,nh){
  if(!ns)return nh;
  if(!nh)return ns;
  return ns.when<nh.when?ns:nh;
}

function nextCombinedState(p,transition){
  return stateAt(p,new Date(transition.when.getTime()+120000),false);
}

function calcPlanet(p,date){
  const st=stateAt(p,date);
  const ns=findTransition(p,date,"sign");
  const nh=findTransition(p,date,"house");
  return {p,st,ns,nh,next:nearestTransition(ns,nh),aspects:activeAspects(st.lon,p,date)};
}
