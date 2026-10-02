async function refresh(){
 const token=++refreshToken;
 renderDateLabel();
 const grid=document.getElementById("planetGrid");
 grid.innerHTML='<div class="loading">Считаю живые положения и ближайшие переходы…</div>';
 lonCache.clear(); states={};
 let done=0;
 try{
   for(const p of PLANETS){
     if(token!==refreshToken)return;
     states[p.key]=calcPlanet(p,viewDate);
     done++;
     grid.innerHTML=`<div class="loading">Считаю живые положения… ${done}/${PLANETS.length}</div>`;
     await new Promise(r=>setTimeout(r,0));
   }
   if(token!==refreshToken)return;
   renderSnapshot();renderVerifiedTimeline();renderGrid();renderDetail();
 }catch(err){
   console.error(err);
   grid.innerHTML='<div class="loading">Не удалось пересчитать эфемериды. Обнови страницу; натальная база и данные не потерялись.</div>';
 }
}

document.getElementById("dateInput").value=dateInputValue(viewDate);
document.getElementById("dateInput").addEventListener("change",setDateFromInput);
document.getElementById("prevDay").onclick=()=>{viewDate=addDays(viewDate,-1);document.getElementById("dateInput").value=dateInputValue(viewDate);refresh()};
document.getElementById("nextDay").onclick=()=>{viewDate=addDays(viewDate,1);document.getElementById("dateInput").value=dateInputValue(viewDate);refresh()};
document.getElementById("todayBtn").onclick=()=>{viewDate=new Date();document.getElementById("dateInput").value=dateInputValue(viewDate);refresh()};
renderNatal();
if(typeof Astronomy==="undefined"){
 document.getElementById("planetGrid").innerHTML='<div class="loading">Не загрузился модуль эфемерид. Обнови страницу — данные сайта не потеряются.</div>';
}else{
 refresh();
}
if("serviceWorker" in navigator){
 window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}
