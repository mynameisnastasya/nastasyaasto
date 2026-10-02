const SIGNS=['Овен','Телец','Близнецы','Рак','Лев','Дева','Весы','Скорпион','Стрелец','Козерог','Водолей','Рыбы'];

const PLANETS=[
 {key:'sun',name:'Солнце',symbol:'☉',body:'Sun',theme:'ядро личности, воля, видимость и ощущение «я»',step:.5,max:60},
 {key:'moon',name:'Луна',symbol:'☾',body:'Moon',theme:'эмоции, тело, привычки, ритм и чувство безопасности',step:.15,max:8},
 {key:'mercury',name:'Меркурий',symbol:'☿',body:'Mercury',theme:'мышление, речь, переговоры, документы и способы принимать решения',step:.35,max:150},
 {key:'venus',name:'Венера',symbol:'♀',body:'Venus',theme:'ценности, деньги, вкус, удовольствие, симпатии и отношения',step:.5,max:220},
 {key:'mars',name:'Марс',symbol:'♂',body:'Mars',theme:'действие, желание, секс, конфликт, скорость и личная воля',step:.75,max:900},
 {key:'jupiter',name:'Юпитер',symbol:'♃',body:'Jupiter',theme:'рост, масштаб, возможности, обучение, вера и расширение',step:2,max:900},
 {key:'saturn',name:'Сатурн',symbol:'♄',body:'Saturn',theme:'структура, ограничения, взросление, ответственность и долгие результаты',step:4,max:1600},
 {key:'uranus',name:'Уран',symbol:'♅',body:'Uranus',theme:'свобода, резкие обновления, технологии, независимость и смена правил',step:8,max:3600},
 {key:'neptune',name:'Нептун',symbol:'♆',body:'Neptune',theme:'чувствительность, образ, мечта, растворение границ, интуиция и иллюзии',step:10,max:5600},
 {key:'pluto',name:'Плутон',symbol:'♇',body:'Pluto',theme:'власть, крайности, глубокая трансформация, контроль и необратимое очищение',step:14,max:7600}
];

const SIGN_STYLE=[
 'действовать первым, прямо, быстро и без долгого разгона',
 'укреплять, материализовывать, выбирать устойчивость и телесную реальность',
 'говорить, пробовать разные варианты, собирать связи и быстро переключаться',
 'защищать своё, искать эмоциональную опору и действовать из чувства принадлежности',
 'проявляться заметно, творить, занимать сцену и требовать права быть увиденной',
 'разбирать по деталям, чинить систему, наводить порядок и улучшать процессы',
 'сверяться с другим человеком, балансировать интересы и оформлять договорённости',
 'углубляться, отсекать поверхностное, видеть скрытые мотивы и усиливать контроль',
 'расширять горизонт, ехать дальше, учиться, рисковать и искать большой смысл',
 'строить надолго, брать ответственность, оформлять статус и считать результат',
 'ломать устаревшие правила, дистанцироваться и собирать свою необычную систему',
 'чувствовать тоньше, отпускать жёсткий контроль, работать с образами и неопределённостью'
];

const HOUSE_DOMAIN={
 1:'тело, образ, самостоятельность, способ проявляться и запуск нового личного цикла',
 2:'личные деньги, цена себе, опора, имущество и стабильность дохода',
 3:'переписки, телефоны, короткий контент, обучение, документы и ежедневные связи',
 4:'дом, семья, база, недвижимость, внутреннее чувство безопасности и место жизни',
 5:'креатив, видео, сцена, удовольствие, романтика, сексуальность и личный бренд',
 6:'режим, здоровье, техника, ежедневная работа, сервис и рабочие процессы',
 7:'отношения, клиенты, партнёрства, договоры, границы и открытые конфликты',
 8:'чужие ресурсы, выплаты, налоги, долги, интимность, риски и глубокие перемены',
 9:'заграница, переезд, визы, обучение, мировоззрение и международные темы',
 10:'карьера, статус, профессия, публичность, репутация и видимый результат',
 11:'аудитория, подписчики, сообщества, приложения, трафик, друзья и планы на будущее',
 12:'закулисье, отдых, приватность, скрытые процессы, завершения и риск самообмана'
};

const HOUSE_ACTION={
 1:'обновлять образ и действовать от своего имени',
 2:'пересматривать цены, доходы и личную финансовую опору',
 3:'оформлять мысли, переписки, документы и контент точнее',
 4:'укреплять базу, жильё, быт и личное чувство безопасности',
 5:'создавать, снимать, тестировать образ и позволять себе больше живого удовольствия',
 6:'чинить режим, рабочую систему, технику и повторяющиеся процессы',
 7:'прояснять правила отношений, клиентов и партнёрств',
 8:'наводить порядок в выплатах, обязательствах, границах и чужих ресурсах',
 9:'заниматься документами, обучением, переездом и международными связями',
 10:'работать на статус, видимый результат и профессиональное имя',
 11:'масштабировать аудиторию, связи, сообщества и долгосрочные планы',
 12:'оставлять пространство для приватности, восстановления и завершения старого'
};

const HOUSE_RISK={
 1:'жить только реакцией окружающих на новый образ',
 2:'путать импульс потратить с реальной устойчивостью',
 3:'обещать в сообщениях больше, чем можно выполнить',
 4:'строить внешние планы без устойчивой базы',
 5:'играть роль, которая расходится с реальными желаниями',
 6:'игнорировать усталость, здоровье или технические сбои',
 7:'додумывать за другого человека вместо прямой договорённости',
 8:'входить в мутные финансовые или эмоциональные обязательства',
 9:'откладывать визовые, юридические и документальные детали',
 10:'принимать репутационные решения на эмоциональном пике',
 11:'зависеть от одной платформы, человека или канала трафика',
 12:'путать тревогу, фантазию и скрытые допущения с фактами'
};

// Проверенная натальная база из файла прогноза 2016–2036.
const NATAL=[
 ['sun','Солнце','☉',11.4928,'Овен','11°29′','8 дом'],
 ['moon','Луна','☾',241.8244,'Стрелец','01°49′','3 дом'],
 ['mercury','Меркурий','☿',5.3783,'Овен','05°22′','8 дом'],
 ['venus','Венера','♀',30.1675,'Телец','00°10′','8 дом'],
 ['mars','Марс','♂',51.5419,'Телец','21°32′','9 дом'],
 ['jupiter','Юпитер','♃',97.1200,'Рак','07°07′','10 дом'],
 ['saturn','Сатурн','♄',70.4586,'Близнецы','10°27′','10 дом'],
 ['uranus','Уран','♅',327.3214,'Водолей','27°19′','6 дом'],
 ['neptune','Нептун','♆',310.5042,'Водолей','10°30′','5 дом'],
 ['pluto','Плутон','♇',257.5903,'Стрелец','17°35′ R','4 дом'],
 ['chiron','Хирон','⚷',278.9639,'Козерог','08°57′','4 дом'],
 ['node','Сев. узел','☊',80.3411,'Близнецы','20°20′ R','10 дом'],
 ['southnode','Юж. узел','☋',260.3411,'Стрелец','20°20′ R','4 дом'],
 ['lilith','Лилит','⚸',354.8142,'Рыбы','24°48′','7 дом'],
 ['selena','Селена','✧',358.1297,'Рыбы','28°07′','7 дом'],
 ['fortune','Фортуна','⊗',33.2231,'Телец','03°13′','9 дом'],
 ['vertex','Вертекс','Vx',321.9914,'Водолей','21°59′','6 дом'],
 ['asc','ASC','AC',162.8917,'Дева','12°53′','1 дом'],
 ['mc','MC','MC',66.2897,'Близнецы','06°17′','10 дом'],
 ['dsc','DSC','DC',342.8917,'Рыбы','12°53′','7 дом'],
 ['ic','IC','IC',246.2897,'Стрелец','06°17′','4 дом']
];

// Placidus, проверенные натальные куспиды.
const CUSPS=[162.8917,183.3975,210.7206,246.2897,285.4086,317.7522,342.8917,3.3975,30.7206,66.2897,105.4086,137.7522];
const CUSP_OFF=CUSPS.map(function(x,i){return {house:i+1,off:(x-CUSPS[0]+360)%360};}).sort(function(a,b){return a.off-b.off;});
const ASPECTS=[['соединение',0,'☌'],['секстиль',60,'⚹'],['квадрат',90,'□'],['трин',120,'△'],['квинконс',150,'⚻'],['оппозиция',180,'☍']];

let selected='saturn';
let states={};
let viewDate=new Date();
let lonCache=new Map();
let refreshToken=0;

function bodyEnum(name){return Astronomy.Body[name];}
function norm360(x){return (x%360+360)%360;}
function signedDiff(a,b){var d=norm360(a-b);return d>180?d-360:d;}

function longitude(bodyName,date){
 var key=bodyName+'@'+Math.round(date.getTime()/1000);
 if(lonCache.has(key)) return lonCache.get(key);
 var v=Astronomy.GeoVector(bodyEnum(bodyName),date,true);
 var lon=norm360(Astronomy.Ecliptic(v).elon);
 lonCache.set(key,lon);
 return lon;
}

function signIndex(lon){return Math.floor(norm360(lon)/30);}

function houseOf(lon){
 var d=norm360(lon-CUSPS[0]);
 var h=1;
 for(var i=0;i<CUSP_OFF.length;i++){
   if(d+1e-8>=CUSP_OFF[i].off) h=CUSP_OFF[i].house;
   else break;
 }
 return h;
}

function motion(body,date){
 var h=(body==='Moon'?3:12)*3600000;
 var a=longitude(body,new Date(date.getTime()-h));
 var b=longitude(body,new Date(date.getTime()+h));
 return signedDiff(b,a)<0?'R':'D';
}

function stateAt(p,date,needMotion){
 var lon=longitude(p.body,date);
 return {lon:lon,sign:signIndex(lon),house:houseOf(lon),motion:needMotion===false?null:motion(p.body,date)};
}

function fmtDeg(lon){
 var within=norm360(lon)%30;
 var d=Math.floor(within);
 var m=Math.floor((within-d)*60);
 return String(d).padStart(2,'0')+'°'+String(m).padStart(2,'0')+'′';
}

function fmtDate(d,withTime){
 var opt=withTime===false?
   {day:'numeric',month:'long',year:'numeric'}:
   {day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'};
 return new Intl.DateTimeFormat('ru-RU',opt).format(d);
}

function dayDiff(a,b){return (b-a)/86400000;}

function durationText(days){
 if(days<1) return Math.max(1,Math.round(days*24))+' ч';
 if(days<45) return Math.max(1,Math.round(days))+' дн.';
 if(days<730) return (days/30.44).toFixed(days<120?1:0)+' мес.';
 return (days/365.25).toFixed(1)+' г.';
}

function addDays(date,n){return new Date(date.getTime()+n*86400000);}
function sameByType(state,base,type){return type==='sign'?state.sign===base.sign:state.house===base.house;}

function findTransition(p,date,type){
 var base=stateAt(p,date,false);
 var prev=new Date(date);
 for(var d=p.step;d<=p.max;d+=p.step){
   var b=addDays(date,d);
   var st=stateAt(p,b,false);
   if(!sameByType(st,base,type)){
     var lo=prev.getTime();
     var hi=b.getTime();
     for(var i=0;i<28;i++){
       var mid=new Date((lo+hi)/2);
       if(sameByType(stateAt(p,mid,false),base,type)) lo=mid.getTime();
       else hi=mid.getTime();
     }
     var when=new Date(hi+1000);
     return {when:when,state:stateAt(p,when,false),days:dayDiff(date,when),type:type};
   }
   prev=b;
 }
 return null;
}

function findPrevTransition(p,date,type){
 var base=stateAt(p,date,false);
 var limit=Math.min(p.max,5600);
 var prev=new Date(date);
 for(var d=p.step;d<=limit;d+=p.step){
   var b=addDays(date,-d);
   var st=stateAt(p,b,false);
   if(!sameByType(st,base,type)){
     var lo=b.getTime();
     var hi=prev.getTime();
     for(var i=0;i<26;i++){
       var mid=new Date((lo+hi)/2);
       if(sameByType(stateAt(p,mid,false),base,type)) hi=mid.getTime();
       else lo=mid.getTime();
     }
     return new Date(hi);
   }
   prev=b;
 }
 return addDays(date,-30);
}

function progression(p,date,next,type){
 if(!next) return 0;
 var prev=findPrevTransition(p,date,type);
 var total=Math.max(1,next.when-prev);
 var done=Math.max(0,date-prev);
 return Math.min(100,Math.max(0,done/total*100));
}

function natalFor(key){
 for(var i=0;i<NATAL.length;i++) if(NATAL[i][0]===key) return NATAL[i];
 return null;
}

function interpret(p,st){
 return p.name+' отвечает у тебя за '+p.theme+'. Сейчас '+SIGNS[st.sign]+' задаёт этому тему: '+SIGN_STYLE[st.sign]+'. Всё это разворачивается через '+st.house+' дом — '+HOUSE_DOMAIN[st.house]+'. Практический фокус: '+HOUSE_ACTION[st.house]+'. Риск: '+HOUSE_RISK[st.house]+'.';
}

function natalBridge(p){
 var n=natalFor(p.key);
 if(!n) return '';
 return ' Натально '+p.name+' стоит в '+n[4]+' '+n[5]+', '+n[6]+'; поэтому текущий транзит читается как новый слой поверх этой врождённой темы.';
}

function transitionMeaning(p,now,next){
 var parts=[];
 if(now.sign!==next.sign) parts.push('знак меняется с '+SIGNS[now.sign]+' на '+SIGNS[next.sign]+': вместо «'+SIGN_STYLE[now.sign]+'» акцент смещается в «'+SIGN_STYLE[next.sign]+'»');
 if(now.house!==next.house) parts.push('фокус переходит из '+now.house+' дома ('+HOUSE_DOMAIN[now.house]+') в '+next.house+' дом ('+HOUSE_DOMAIN[next.house]+')');
 return parts.join('. ')+(parts.length?'.':'');
}

function activeAspects(lon,p,date){
 var orbLimit=['jupiter','saturn','uranus','neptune','pluto'].indexOf(p.key)>=0?3.0:2.0;
 var futureLon=longitude(p.body,addDays(date,p.key==='moon'?.08:.5));
 var out=[];
 for(var ni=0;ni<NATAL.length;ni++){
   var n=NATAL[ni];
   var sep=Math.abs(signedDiff(lon,n[3]));
   var futureSep=Math.abs(signedDiff(futureLon,n[3]));
   for(var ai=0;ai<ASPECTS.length;ai++){
     var a=ASPECTS[ai];
     var orb=Math.abs(sep-a[1]);
     if(orb<=orbLimit){
       var futureOrb=Math.abs(futureSep-a[1]);
       out.push({name:a[0],angle:a[1],glyph:a[2],orb:orb,natal:n,trend:futureOrb<orb?'сходится':'расходится'});
     }
   }
 }
 return out.sort(function(a,b){return a.orb-b.orb;}).slice(0,6);
}

function aspectMeaning(a){
 var map={
  'соединение':'сливает транзит и натальную функцию в одну громкую тему',
  'секстиль':'даёт удобный канал, который работает лучше, если самой им воспользоваться',
  'квадрат':'создаёт трение и требует изменить привычный способ действовать',
  'трин':'усиливает естественный поток и то, что уже умеет работать без лишнего сопротивления',
  'квинконс':'требует тонкой перенастройки: старые настройки вроде работают, но уже не идеально',
  'оппозиция':'выносит тему наружу через других людей, обстоятельства и необходимость баланса'
 };
 return a.name+' к '+a.natal[1]+': '+map[a.name]+'.';
}

function nearestTransition(ns,nh){
 if(!ns) return nh;
 if(!nh) return ns;
 return ns.when<nh.when?ns:nh;
}

function nextCombinedState(p,transition){
 return stateAt(p,new Date(transition.when.getTime()+120000),false);
}

function calcPlanet(p,date){
 var st=stateAt(p,date,true);
 var ns=findTransition(p,date,'sign');
 var nh=findTransition(p,date,'house');
 return {p:p,st:st,ns:ns,nh:nh,next:nearestTransition(ns,nh),aspects:activeAspects(st.lon,p,date)};
}

function renderNatal(){
 var el=document.getElementById('natalGrid');
 var hidden=['fortune','vertex','asc','mc','dsc','ic'];
 el.innerHTML=NATAL.filter(function(n){return hidden.indexOf(n[0])<0;}).map(function(n){
   return '<div class="natal-item"><b>'+n[2]+' '+n[1]+'</b><div>'+n[4]+' '+n[5]+'</div><small>'+n[6]+'</small></div>';
 }).join('');
}

function dateInputValue(d){
 var x=new Date(d.getTime()-d.getTimezoneOffset()*60000);
 return x.toISOString().slice(0,10);
}

function setDateFromInput(){
 var v=document.getElementById('dateInput').value;
 if(!v) return;
 var parts=v.split('-').map(Number);
 viewDate=new Date(parts[0],parts[1]-1,parts[2],12,0,0);
 refresh();
}

function renderSnapshot(){
 var el=document.getElementById('snapshot');
 var rows=Object.keys(states).map(function(k){return states[k];});
 var strongest=[];
 rows.forEach(function(x){
   x.aspects.forEach(function(a){strongest.push({p:x.p,a:a});});
 });
 strongest.sort(function(a,b){return a.a.orb-b.a.orb;});
 strongest=strongest.slice(0,3);

 var counts={};
 rows.forEach(function(x){counts[x.st.house]=(counts[x.st.house]||0)+1;});
 var houses=Object.keys(counts).map(function(h){return [h,counts[h]];}).sort(function(a,b){return b[1]-a[1]||Number(a[0])-Number(b[0]);}).slice(0,3);
 var retro=rows.filter(function(x){return x.st.motion==='R';}).map(function(x){return x.p.name;});

 var focusHtml=strongest.length?strongest.map(function(x){
   return '<div class="focus-line"><span>'+x.p.symbol+' '+x.p.name+' '+x.a.glyph+' '+x.a.natal[1]+' · '+x.a.trend+'</span><span>'+x.a.orb.toFixed(2)+'°</span></div>';
 }).join(''):'<p>Сейчас важнее читать дома и знаки.</p>';

 var houseHtml=houses.length?houses.map(function(x){
   return x[0]+' дом · '+x[1]+' '+(x[1]===1?'планета':'планеты');
 }).join('<br>'):'Нет данных';

 el.innerHTML=
  '<article class="snapshot-card"><div class="panel-label">главное сейчас</div><strong>'+(strongest[0]?strongest[0].p.name+' '+strongest[0].a.name+' '+strongest[0].a.natal[1]:'Без тесных аспектов')+'</strong><div class="focus-lines">'+focusHtml+'</div></article>'+
  '<article class="snapshot-card"><div class="panel-label">активные дома</div><strong>'+(houses[0]?houses[0][0]+' дом':'—')+'</strong><p>'+houseHtml+'<br><span class="gold-note">Это твои натальные дома Placidus.</span></p></article>'+
  '<article class="snapshot-card"><div class="panel-label">ретроградные сейчас</div><strong>'+(retro.length?retro.length:'0')+'</strong><p>'+(retro.length?retro.join(' · '):'Все 10 основных планет движутся директно.')+'</p></article>';
}

function renderGrid(){
 var grid=document.getElementById('planetGrid');
 grid.innerHTML=PLANETS.map(function(p){
   var x=states[p.key];
   var t=x.next;
   var change=t?(t.type==='sign'?'→ '+SIGNS[t.state.sign]:'→ '+t.state.house+' дом'):'';
   return '<article class="planet-card '+(selected===p.key?'active':'')+'" data-key="'+p.key+'" role="button" tabindex="0" aria-label="'+p.name+': '+SIGNS[x.st.sign]+', '+x.st.house+' дом">'+
    '<div class="pc-top"><div class="glyph">'+p.symbol+'</div><div class="motion">'+(x.st.motion==='R'?'retro':'direct')+'</div></div>'+
    '<div class="planet-name">'+p.name+'</div>'+
    '<div class="position">'+SIGNS[x.st.sign]+' '+fmtDeg(x.st.lon)+'</div>'+
    '<div class="house">'+x.st.house+' дом · '+HOUSE_DOMAIN[x.st.house].split(',')[0]+'</div>'+
    '<div class="next-mini"><span>'+(t?durationText(t.days):'—')+'</span><span>'+change+'</span></div>'+
   '</article>';
 }).join('');

 Array.prototype.forEach.call(grid.querySelectorAll('.planet-card'),function(card){
   var choose=function(){selected=card.dataset.key;renderGrid();renderDetail();};
   card.onclick=choose;
   card.onkeydown=function(e){
     if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}
   };
 });
}

function renderDetail(){
 var x=states[selected];
 if(!x) return;

 var p=x.p,st=x.st,ns=x.ns,nh=x.nh,next=x.next,aspects=x.aspects;
 var natal=natalFor(p.key);
 var after=next?nextCombinedState(p,next):st;
 var pSign=ns?progression(p,viewDate,ns,'sign'):0;
 var pHouse=nh?progression(p,viewDate,nh,'house'):0;
 var main=document.getElementById('detailMain');
 var side=document.getElementById('detailSide');

 var nextText=next?transitionMeaning(p,st,after):'Переход не найден в расчётном окне.';
 var natalText=natal?natal[4]+' '+natal[5]+' · '+natal[6]:'точка не задана';

 main.innerHTML=
  '<div class="panel-label">выбрано · '+p.name+'</div>'+
  '<div class="detail-head"><div><div class="detail-title">'+SIGNS[st.sign]+' · '+st.house+' дом</div><div class="detail-sub">'+fmtDeg(st.lon)+' · '+(st.motion==='R'?'ретроградное':'директное')+' движение</div></div><div class="big-glyph">'+p.symbol+'</div></div>'+
  '<div class="now-next">'+
   '<div class="state"><div class="panel-label">сейчас</div><h3>'+SIGNS[st.sign]+' / '+st.house+' дом</h3><p>'+p.theme+'</p></div>'+
   '<div class="state next"><div class="panel-label">следующий переход</div><h3>'+(next?fmtDate(next.when,false):'—')+'</h3><p>'+nextText+'</p></div>'+
  '</div>'+
  '<div class="progress-row"><div class="progress-label"><span>путь по знаку</span><span>'+(ns?durationText(ns.days)+' до '+SIGNS[ns.state.sign]:'—')+'</span></div><div class="track"><div class="fill" style="width:'+pSign.toFixed(1)+'%"></div></div></div>'+
  '<div class="progress-row"><div class="progress-label"><span>путь по натальному дому</span><span>'+(nh?durationText(nh.days)+' до '+nh.state.house+' дома':'—')+'</span></div><div class="track"><div class="fill" style="width:'+pHouse.toFixed(1)+'%"></div></div></div>'+
  '<div class="interpret"><div class="panel-label">расшифровка на сейчас</div><h2>Что это делает именно у тебя</h2><p>'+interpret(p,st)+natalBridge(p)+'</p>'+
   '<div class="natal-anchor"><div class="na-symbol">'+(natal?natal[2]:p.symbol)+'</div><div class="na-text"><b>Натальный '+p.name+'</b><span>'+natalText+'</span></div></div>'+
   (next?'<div class="quote"><b>Что поменяется дальше.</b> '+interpret(p,after)+' '+transitionMeaning(p,st,after)+'</div>':'')+
  '</div>';

 var aspectsHtml=aspects.length?aspects.map(function(a){
   return '<div class="aspect"><strong>'+a.glyph+'</strong><div><strong>'+a.name+' · '+a.natal[1]+'</strong><span>'+aspectMeaning(a)+' · '+a.trend+'</span></div><span class="orb">'+a.orb.toFixed(2)+'°</span></div>';
 }).join(''):'<div class="quote">Сейчас у '+p.name+' нет тесного аспекта в выбранном орбе к натальным планетам и точкам. Значит, сильнее читается именно дом и знак — без натягивания «судьбоносного» контакта.</div>';

 side.innerHTML=
  '<div class="panel-label">натальные контакты</div><h2 class="section-title">Что цепляет сейчас</h2>'+
  '<div class="aspects">'+aspectsHtml+'</div>'+
  '<div class="upcoming"><div class="panel-label side-label">ближайшие движения</div>'+
   (ns?'<div class="event"><div class="dot"></div><div><b>'+fmtDate(ns.when,true)+' · смена знака</b><span>'+SIGNS[st.sign]+' → '+SIGNS[ns.state.sign]+'</span></div></div>':'')+
   (nh?'<div class="event"><div class="dot"></div><div><b>'+fmtDate(nh.when,true)+' · смена дома</b><span>'+st.house+' → '+nh.state.house+' дом · '+HOUSE_DOMAIN[nh.state.house]+'</span></div></div>':'')+
  '</div>';

 document.getElementById('detail').hidden=false;
}

function renderDateLabel(){
 var now=new Date();
 var same=dateInputValue(now)===dateInputValue(viewDate);
 var tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'часовой пояс устройства';
 document.getElementById('dateLabel').textContent=(same?'Сейчас':'Срез на')+' '+fmtDate(viewDate,false)+' · время переходов: '+tz;
}

async function refresh(){
 var token=++refreshToken;
 renderDateLabel();
 var grid=document.getElementById('planetGrid');
 grid.innerHTML='<div class="loading">Считаю живые положения и ближайшие переходы…</div>';
 lonCache.clear();
 states={};

 for(var i=0;i<PLANETS.length;i++){
   if(token!==refreshToken) return;
   var p=PLANETS[i];
   states[p.key]=calcPlanet(p,viewDate);
   grid.innerHTML='<div class="loading">Считаю живые положения… '+(i+1)+'/'+PLANETS.length+'</div>';
   await new Promise(function(resolve){setTimeout(resolve,0);});
 }

 if(token!==refreshToken) return;
 renderSnapshot();
 renderGrid();
 renderDetail();
}

document.getElementById('dateInput').value=dateInputValue(viewDate);
document.getElementById('dateInput').addEventListener('change',setDateFromInput);
document.getElementById('prevDay').onclick=function(){viewDate=addDays(viewDate,-1);document.getElementById('dateInput').value=dateInputValue(viewDate);refresh();};
document.getElementById('nextDay').onclick=function(){viewDate=addDays(viewDate,1);document.getElementById('dateInput').value=dateInputValue(viewDate);refresh();};
document.getElementById('todayBtn').onclick=function(){viewDate=new Date();document.getElementById('dateInput').value=dateInputValue(viewDate);refresh();};

renderNatal();

if(typeof Astronomy==='undefined'){
 document.getElementById('planetGrid').innerHTML='<div class="loading">Не загрузился модуль эфемерид. Обнови страницу — данные сайта не потеряются.</div>';
}else{
 refresh();
}

if('serviceWorker' in navigator){
 window.addEventListener('load',function(){
   navigator.serviceWorker.register('./sw.js').catch(function(){});
 });
}
