function renderNatal(){
 const el=document.getElementById("natalGrid");
 el.innerHTML=NATAL
  .filter(n=>!["fortune","vertex","asc","mc","dsc","ic"].includes(n[0]))
  .map(n=>`<div class="natal-item"><b>${n[2]} ${n[1]}</b><div>${n[4]} ${n[5]}</div><small>${n[6]}</small></div>`)
  .join("");
}

function dateInputValue(d){
 const x=new Date(d.getTime()-d.getTimezoneOffset()*60000);
 return x.toISOString().slice(0,10);
}

function setDateFromInput(){
 const v=document.getElementById("dateInput").value;
 if(!v)return;
 const [y,m,d]=v.split("-").map(Number);
 viewDate=new Date(y,m-1,d,12,0,0);
 refresh();
}

function renderSnapshot(){
 const el=document.getElementById("snapshot"), rows=Object.values(states);
 const strongest=rows.flatMap(x=>x.aspects.map(a=>({p:x.p,a}))).sort((x,y)=>x.a.orb-y.a.orb).slice(0,3);
 const counts={}; rows.forEach(x=>counts[x.st.house]=(counts[x.st.house]||0)+1);
 const houses=Object.entries(counts).sort((a,b)=>b[1]-a[1]||Number(a[0])-Number(b[0])).slice(0,3);
 const retro=rows.filter(x=>x.st.motion==="R").map(x=>x.p.name);
 el.innerHTML=`
  <article class="snapshot-card"><div class="panel-label">главное сейчас</div><strong>${strongest[0]?strongest[0].p.name+" "+strongest[0].a.name+" "+strongest[0].a.natal[1]:"Без тесных аспектов"}</strong><div class="focus-lines">${strongest.length?strongest.map(x=>`<div class="focus-line"><span>${x.p.symbol} ${x.p.name} ${x.a.glyph} ${x.a.natal[1]} · ${x.a.trend}</span><span>${x.a.orb.toFixed(2)}°</span></div>`).join(""):`<p>Сейчас важнее читать дома и знаки.</p>`}</div></article>
  <article class="snapshot-card"><div class="panel-label">активные дома</div><strong>${houses[0]?houses[0][0]+" дом":"—"}</strong><p>${houses.length?houses.map(([h,c])=>`${h} дом · ${c} ${c==1?"планета":"планеты"}`).join("<br>"):"Нет данных"}<br><span style="color:#a98b68">Это твои натальные дома Placidus.</span></p></article>
  <article class="snapshot-card"><div class="panel-label">ретроградные сейчас</div><strong>${retro.length?retro.length:"0"}</strong><p>${retro.length?retro.join(" · "):"Все 10 основных планет движутся директно."}</p></article>`;
}

function renderGrid(){
 const grid=document.getElementById("planetGrid");
 grid.innerHTML=PLANETS.map(p=>{
  const x=states[p.key],t=x.next,change=t?(t.type==="sign"?`→ ${SIGNS[t.state.sign]}`:`→ ${t.state.house} дом`):"";
  return `<article class="planet-card ${selected===p.key?"active":""}" data-key="${p.key}" role="button" tabindex="0" aria-label="${p.name}: ${SIGNS[x.st.sign]}, ${x.st.house} дом"><div class="pc-top"><div class="glyph">${p.symbol}</div><div class="motion">${x.st.motion==="R"?"retro":"direct"}</div></div><div class="planet-name">${p.name}</div><div class="position">${SIGNS[x.st.sign]} ${fmtDeg(x.st.lon)}</div><div class="house">${x.st.house} дом · ${HOUSE_DOMAIN[x.st.house].split(",")[0]}</div><div class="next-mini"><span>${t?durationText(t.days):"—"}</span><span>${change}</span></div></article>`;
 }).join("");
 grid.querySelectorAll(".planet-card").forEach(card=>{
   const choose=()=>{selected=card.dataset.key;renderGrid();renderDetail();};
   card.onclick=choose;
   card.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();choose()}};
 });
}

function renderDetail(){
 const x=states[selected]; if(!x)return;
 const {p,st,ns,nh,next,aspects}=x;
 const natal=natalFor(p.key), after=next?nextCombinedState(p,next):st;
 const pSign=ns?progression(p,viewDate,ns,"sign"):0, pHouse=nh?progression(p,viewDate,nh,"house"):0;
 const main=document.getElementById("detailMain"),side=document.getElementById("detailSide");
 main.innerHTML=`<div class="panel-label">выбрано · ${p.name}</div><div class="detail-head"><div><div class="detail-title">${SIGNS[st.sign]} · ${st.house} дом</div><div class="detail-sub">${fmtDeg(st.lon)} · ${st.motion==="R"?"ретроградное":"директное"} движение</div></div><div class="big-glyph">${p.symbol}</div></div><div class="now-next"><div class="state"><div class="panel-label">сейчас</div><h3>${SIGNS[st.sign]} / ${st.house} дом</h3><p>${p.theme}</p></div><div class="state next"><div class="panel-label">следующий переход</div><h3>${next?fmtDate(next.when,false):"—"}</h3><p>${next?transitionMeaning(p,st,after):"Переход не найден в расчётном окне."}</p></div></div><div class="progress-row"><div class="progress-label"><span>путь по знаку</span><span>${ns?`${durationText(ns.days)} до ${SIGNS[ns.state.sign]}`:"—"}</span></div><div class="track"><div class="fill" style="width:${pSign.toFixed(1)}%"></div></div></div><div class="progress-row"><div class="progress-label"><span>путь по натальному дому</span><span>${nh?`${durationText(nh.days)} до ${nh.state.house} дома`:"—"}</span></div><div class="track"><div class="fill" style="width:${pHouse.toFixed(1)}%"></div></div></div><div class="interpret"><div class="panel-label">расшифровка на сейчас</div><h2>Что это делает именно у тебя</h2><p>${interpret(p,st)}${natalBridge(p)}</p><div class="natal-anchor"><div class="na-symbol">${natal?natal[2]:p.symbol}</div><div class="na-text"><b>Натальный ${p.name}</b><span>${natal?`${natal[4]} ${natal[5]} · ${natal[6]}`:"точка не задана"}</span></div></div>${next?`<div class="quote"><b>Что поменяется дальше.</b> ${interpret(p,after)} ${transitionMeaning(p,st,after)}</div>`:""}</div>`;
 side.innerHTML=`<div class="panel-label">натальные контакты</div><h2 class="section-title">Что цепляет сейчас</h2><div class="aspects">${aspects.length?aspects.map(a=>`<div class="aspect"><strong>${a.glyph}</strong><div><strong>${a.name} · ${a.natal[1]}</strong><span>${aspectMeaning(a)} · ${a.trend}</span></div><span class="orb">${a.orb.toFixed(2)}°</span></div>`).join(""):`<div class="quote">Сейчас у ${p.name} нет тесного аспекта к основным натальным точкам. Значит, сильнее читается именно дом и знак, без необходимости натягивать «судьбоносный» контакт.</div>`}</div><div class="upcoming"><div class="panel-label" style="margin-top:25px">ближайшие движения</div>${ns?`<div class="event"><div class="dot"></div><div><b>${fmtDate(ns.when)} · смена знака</b><span>${SIGNS[st.sign]} → ${SIGNS[ns.state.sign]}</span></div></div>`:""}${nh?`<div class="event"><div class="dot"></div><div><b>${fmtDate(nh.when)} · смена дома</b><span>${st.house} → ${nh.state.house} дом · ${HOUSE_DOMAIN[nh.state.house]}</span></div></div>`:""}</div>`;
 document.getElementById("detail").hidden=false;
}

function renderDateLabel(){
 const now=new Date(),same=dateInputValue(now)===dateInputValue(viewDate);
 const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||"часовой пояс устройства";
 document.getElementById("dateLabel").textContent=`${same?"Сейчас":"Срез на"} ${fmtDate(viewDate,false)} · ${tz} · дома = натальные Placidus`;
}

function renderVerifiedTimeline(){
 const host=document.getElementById("verifiedTimeline");
 if(!host || typeof VERIFIED_EVENTS==="undefined")return;
 const threshold=viewDate.getTime()-12*3600000;
 const items=VERIFIED_EVENTS.filter(e=>e[0]>=threshold).slice().sort((a,b)=>a[0]-b[0]).slice(0,10);
 host.innerHTML=items.length?items.map(e=>{
   const when=new Date(e[0]), category=e[2], exact=Boolean(e[3]);
   const label=category==="lunar"?"лунация / затмение":category==="station"?"станция планеты":exact?"персональный · точный":"персональный · сближение";
   const note=category==="personal"?(exact?"точный контакт":"ближайшее сближение · без точного прохода"):category==="station"?"точная смена направления":"точная геоцентрическая фаза";
   return `<article class="verified-event"><div class="verified-date">${fmtDate(when)}</div><div><b>${e[1]}</b><span>${note}</span><span class="verified-kind">${label}</span></div></article>`;
 }).join(""):`<div class="quote">Для выбранной даты в проверенном диапазоне больше нет событий. Живой расчёт планет выше продолжает работать.</div>`;
}
