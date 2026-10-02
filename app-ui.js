function renderNatal(){
 const el=document.getElementById("natalGrid");
 el.innerHTML=NATAL
  .filter(function(n){return !["fortune","vertex","asc","mc","dsc","ic"].includes(n[0]);})
  .map(function(n){
    return '<div class="natal-item"><b>'+n[2]+' '+n[1]+'</b><div>'+n[4]+' '+n[5]+'</div><small>'+n[6]+'</small></div>';
  }).join("");
}

function dateInputValue(d){
 const x=new Date(d.getTime()-d.getTimezoneOffset()*60000);
 return x.toISOString().slice(0,10);
}

function setDateFromInput(){
 const v=document.getElementById("dateInput").value;
 if(!v)return;
 const parts=v.split("-").map(Number);
 viewDate=new Date(parts[0],parts[1]-1,parts[2],12,0,0);
 refresh();
}

function calendarMeta(category,exact){
 if(category==="lunar")return {label:"лунация",note:"точная геоцентрическая фаза",cls:"lunar"};
 if(category==="station")return {label:"станция",note:"точная смена направления",cls:"station"};
 return exact
   ?{label:"личный · точный",note:"точный контакт с натальной картой",cls:"personal"}
   :{label:"личный · сближение",note:"без точного прохода",cls:"personal"};
}

function renderSnapshot(){
 const el=document.getElementById("snapshot");
 const rows=Object.values(states);
 const strongest=[];
 rows.forEach(function(x){
   x.aspects.forEach(function(a){strongest.push({p:x.p,a:a,house:x.st.house});});
 });
 strongest.sort(function(a,b){return a.a.orb-b.a.orb;});
 const top=strongest.slice(0,3);

 const counts={};
 rows.forEach(function(x){counts[x.st.house]=(counts[x.st.house]||0)+1;});
 const houses=Object.entries(counts).sort(function(a,b){return b[1]-a[1]||Number(a[0])-Number(b[0]);});
 const mainHouse=houses[0]||null;
 const retro=rows.filter(function(x){return x.st.motion==="R";}).map(function(x){return x.p.name;});

 let nextEvent=null;
 if(typeof VERIFIED_EVENTS!=="undefined"){
   const threshold=viewDate.getTime()-12*3600000;
   nextEvent=VERIFIED_EVENTS.filter(function(e){return e[0]>=threshold;}).sort(function(a,b){return a[0]-b[0];})[0]||null;
 }

 const focusTitle=top[0]
   ?top[0].p.name+" "+top[0].a.name+" "+top[0].a.natal[1]
   :"Без тесного аспекта";
 const focusLines=top.length
   ?top.map(function(x){
      return '<div class="focus-line"><span>'+x.p.symbol+' '+x.p.name+' '+x.a.glyph+' '+x.a.natal[1]+' · '+x.a.trend+'</span><span>'+x.a.orb.toFixed(2)+'°</span></div>';
    }).join("")
   :'<p>В этой точке сильнее читаются знак и натальный дом.</p>';

 let eventHtml='<strong>—</strong><p>В проверенном диапазоне дальше событий нет.</p>';
 if(nextEvent){
   const meta=calendarMeta(nextEvent[2],Boolean(nextEvent[3]));
   eventHtml='<strong>'+nextEvent[1]+'</strong><p>'+fmtDate(new Date(nextEvent[0]))+'<br>'+meta.label+'</p>';
 }

 el.innerHTML=
  '<article class="snapshot-card primary"><div class="snapshot-label">главный фокус</div><strong>'+focusTitle+'</strong><div class="focus-lines">'+focusLines+'</div></article>'+
  '<article class="snapshot-card"><div class="snapshot-label">ближайшее проверенное</div>'+eventHtml+'</article>'+
  '<article class="snapshot-card"><div class="snapshot-label">активный дом</div><strong class="metric">'+(mainHouse?mainHouse[0]:"—")+'</strong><p>'+(mainHouse?mainHouse[1]+' '+(mainHouse[1]===1?"планета":"планеты")+' · '+HOUSE_DOMAIN[Number(mainHouse[0])].split(",")[0]:"Нет данных")+'</p></article>'+
  '<article class="snapshot-card"><div class="snapshot-label">retro</div><strong class="metric">'+retro.length+'</strong><p>'+(retro.length?retro.join(" · "):"Все 10 основных планет директны")+'</p></article>';
}

function renderGrid(){
 const grid=document.getElementById("planetGrid");
 grid.innerHTML=PLANETS.map(function(p){
   const x=states[p.key];
   const t=x.next;
   const change=t?(t.type==="sign"?"→ "+SIGNS[t.state.sign]:"→ "+t.state.house+" дом"):"";
   return '<article class="planet-card '+(selected===p.key?"active":"")+'" data-key="'+p.key+'" role="button" tabindex="0" aria-label="'+p.name+': '+SIGNS[x.st.sign]+', '+x.st.house+' дом">'+
     '<div class="pc-top"><div class="glyph">'+p.symbol+'</div><div class="motion '+(x.st.motion==="R"?"is-retro":"")+'">'+(x.st.motion==="R"?"retro":"direct")+'</div></div>'+
     '<div class="planet-name">'+p.name+'</div>'+
     '<div class="position">'+SIGNS[x.st.sign]+' '+fmtDeg(x.st.lon)+'</div>'+
     '<div class="house">'+x.st.house+' дом · '+HOUSE_DOMAIN[x.st.house].split(",")[0]+'</div>'+
     '<div class="next-mini"><span>'+(t?"через "+durationText(t.days):"—")+'</span><span>'+change+'</span></div>'+
   '</article>';
 }).join("");

 grid.querySelectorAll(".planet-card").forEach(function(card){
   const choose=function(){
     selected=card.dataset.key;
     renderGrid();
     renderDetail();
     if(window.matchMedia("(max-width:700px)").matches){
       window.setTimeout(function(){
         document.getElementById("detail").scrollIntoView({behavior:"smooth",block:"start"});
       },20);
     }
   };
   card.onclick=choose;
   card.onkeydown=function(e){
     if(e.key==="Enter"||e.key===" "){e.preventDefault();choose();}
   };
 });
}

function renderDetail(){
 const x=states[selected];
 if(!x)return;
 const p=x.p,st=x.st,ns=x.ns,nh=x.nh,next=x.next,aspects=x.aspects;
 const natal=natalFor(p.key);
 const after=next?nextCombinedState(p,next):st;
 const pSign=ns?progression(p,viewDate,ns,"sign"):0;
 const pHouse=nh?progression(p,viewDate,nh,"house"):0;
 const main=document.getElementById("detailMain");
 const side=document.getElementById("detailSide");

 const nowText=p.name+" сейчас работает через "+SIGNS[st.sign]+": "+SIGN_STYLE[st.sign]+". Главная сцена — "+st.house+" дом: "+HOUSE_DOMAIN[st.house]+".";
 const natalText=natal?natal[4]+" "+natal[5]+" · "+natal[6]:"точка не задана";

 main.innerHTML=
  '<div class="panel-label">выбрано · '+p.name+'</div>'+
  '<div class="detail-head"><div><div class="detail-title">'+SIGNS[st.sign]+' · '+st.house+' дом</div><div class="detail-sub">'+fmtDeg(st.lon)+' · '+(st.motion==="R"?"ретроградное":"директное")+' движение</div></div><div class="big-glyph">'+p.symbol+'</div></div>'+
  '<div class="now-next">'+
    '<div class="state"><div class="panel-label">что происходит</div><h3>'+SIGNS[st.sign]+' / '+st.house+' дом</h3><p>'+HOUSE_DOMAIN[st.house]+'</p></div>'+
    '<div class="state next"><div class="panel-label">что меняется дальше</div><h3>'+(next?fmtDate(next.when,false):"—")+'</h3><p>'+(next?transitionMeaning(p,st,after):"Переход не найден в расчётном окне.")+'</p></div>'+
  '</div>'+
  '<div class="progress-row"><div class="progress-label"><span>по знаку</span><span>'+(ns?durationText(ns.days)+" до "+SIGNS[ns.state.sign]:"—")+'</span></div><div class="track"><div class="fill" style="width:'+pSign.toFixed(1)+'%"></div></div></div>'+
  '<div class="progress-row"><div class="progress-label"><span>по натальному дому</span><span>'+(nh?durationText(nh.days)+" до "+nh.state.house+" дома":"—")+'</span></div><div class="track"><div class="fill" style="width:'+pHouse.toFixed(1)+'%"></div></div></div>'+
  '<div class="interpret"><div class="panel-label">как читать это для себя</div><h2>Смысл транзита</h2><p>'+nowText+natalBridge(p)+'</p>'+
    '<div class="quote"><b>Фокус действия:</b> '+HOUSE_ACTION[st.house]+'.<br><b>Риск:</b> '+HOUSE_RISK[st.house]+'.</div>'+
    '<div class="natal-anchor"><div class="na-symbol">'+(natal?natal[2]:p.symbol)+'</div><div class="na-text"><b>Натальный '+p.name+'</b><span>'+natalText+'</span></div></div>'+
    (next?'<div class="quote"><b>После перехода:</b> '+transitionMeaning(p,st,after)+' Новый практический фокус — '+HOUSE_ACTION[after.house]+'.</div>':"")+
  '</div>';

 const aspectsHtml=aspects.length
  ?aspects.map(function(a){
     return '<div class="aspect"><strong>'+a.glyph+'</strong><div><strong>'+a.name+' · '+a.natal[1]+'</strong><span>'+a.trend+' · '+aspectMeaning(a)+'</span></div><span class="orb">'+a.orb.toFixed(2)+'°</span></div>';
   }).join("")
  :'<div class="quote">Тесного аспекта к натальным точкам сейчас нет. Не нужно искусственно делать этот транзит «судьбоносным» — важнее знак и дом.</div>';

 side.innerHTML=
  '<div class="panel-label">натальные контакты</div><h2 class="section-title">Что именно задевает</h2>'+
  '<div class="aspects">'+aspectsHtml+'</div>'+
  '<div class="upcoming"><div class="panel-label" style="margin-top:20px">ближайшие движения</div>'+
   (ns?'<div class="event"><div class="dot"></div><div><b>'+fmtDate(ns.when)+' · смена знака</b><span>'+SIGNS[st.sign]+' → '+SIGNS[ns.state.sign]+'</span></div></div>':"")+
   (nh?'<div class="event"><div class="dot"></div><div><b>'+fmtDate(nh.when)+' · смена дома</b><span>'+st.house+' → '+nh.state.house+' дом</span></div></div>':"")+
  '</div>';

 document.getElementById("detail").hidden=false;
}

function renderDateLabel(){
 const now=new Date();
 const same=dateInputValue(now)===dateInputValue(viewDate);
 const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||"часовой пояс устройства";
 document.getElementById("dateLabel").textContent=(same?"Сейчас":"Срез")+" · "+fmtDate(viewDate,false)+" · "+tz;
}

function currentCalendarFilter(){
 const active=document.querySelector(".filter-btn.active");
 return active?active.dataset.filter:"all";
}

function bindCalendarFilters(){
 document.querySelectorAll(".filter-btn").forEach(function(btn){
   btn.onclick=function(){
     document.querySelectorAll(".filter-btn").forEach(function(x){x.classList.remove("active");});
     btn.classList.add("active");
     renderVerifiedTimeline();
   };
 });
}

function renderVerifiedTimeline(){
 const host=document.getElementById("verifiedTimeline");
 if(!host || typeof VERIFIED_EVENTS==="undefined")return;

 const threshold=viewDate.getTime()-12*3600000;
 const filter=currentCalendarFilter();
 const items=VERIFIED_EVENTS
  .filter(function(e){return e[0]>=threshold && (filter==="all" || e[2]===filter);})
  .slice()
  .sort(function(a,b){return a[0]-b[0];})
  .slice(0,12);

 host.innerHTML=items.length
  ?items.map(function(e){
     const when=new Date(e[0]);
     const meta=calendarMeta(e[2],Boolean(e[3]));
     return '<article class="verified-event">'+
       '<div class="verified-date">'+fmtDate(when)+'</div>'+
       '<span class="verified-kind '+meta.cls+'">'+meta.label+'</span>'+
       '<div class="verified-body"><b>'+e[1]+'</b><span>'+meta.note+'</span></div>'+
     '</article>';
   }).join("")
  :'<div class="quote">В выбранной категории после этой даты событий больше нет. Можно переключить фильтр или выбрать другую дату.</div>';

 bindCalendarFilters();
}
