/* Progressive enhancement only; all services remain in the source HTML. */
(function(){'use strict';
const input=document.getElementById('service-search');
const buttons=Array.from(document.querySelectorAll('[data-service-filter]'));
const rows=Array.from(document.querySelectorAll('.service-row'));
const status=document.getElementById('service-status');
if(!rows.length)return;
let filter='all';
function update(){const q=(input?.value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();let visible=0;rows.forEach(row=>{const cat=row.getAttribute('data-cat');const content=row.textContent.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const show=(filter==='all'||filter===cat)&&(!q||content.includes(q));row.hidden=!show;if(show)visible++});if(status)status.textContent=visible?visible+' '+(document.documentElement.lang==='en'?'services':'usług'):(document.documentElement.lang==='en'?'No matching services.':'Nie znaleziono usług.');}
buttons.forEach(button=>button.addEventListener('click',()=>{filter=button.getAttribute('data-service-filter');buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));update()}));input?.addEventListener('input',update);update();
})();