import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const h=fs.readFileSync(new URL('Workshopprogram.html',import.meta.url),'utf8');
const scripts=[...h.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)];
const seed=JSON.parse(scripts[0][1]);
for(const s of scripts.slice(1))new vm.Script(s[1]);
const nodes=new Map(),session=new Map();let callback=null;
function el(id){if(!nodes.has(id))nodes.set(id,{hidden:true,style:{},attrs:{},classList:{add(){},remove(){},toggle(){}},setAttribute(k,v){this.attrs[k]=v}});return nodes.get(id)}
const state=structuredClone(seed);
const context=vm.createContext({state,key:'test',$:el,esc:s=>String(s).replace(/</g,'&lt;'),sessionStorage:{getItem:k=>session.get(k),setItem:(k,v)=>session.set(k,v)},setTimeout:f=>{callback=f;return 1},clearTimeout(){},window:{matchMedia:()=>({matches:false}),scrollTo(){}},document:{body:el('body'),addEventListener(){}},console});
vm.runInContext(scripts[2][1],context);
assert.equal(el('group-view').hidden,true);
el('tab-group').onclick();assert.equal(el('door-intro').hidden,false);assert.equal(el('group-view').hidden,false);assert.match(el('journey').innerHTML,/Återblick/);
callback();assert.equal(el('door-intro').hidden,true);
el('tab-plan').onclick();state.cards.reverse();state.cards[0].title='Mitt nya avslut';el('tab-group').onclick();assert.equal(el('door-intro').hidden,true);assert.match(el('journey').innerHTML,/01<\/small><h2>Mitt nya avslut/);
el('replay-intro').onclick();assert.equal(el('door-intro').hidden,false);el('skip-intro').onclick();assert.equal(el('door-intro').hidden,true);
console.log('Verifierat: vybyte, introduktion en gång, återspelning, hoppa över samt uppdaterad ordning och rubrik.');
